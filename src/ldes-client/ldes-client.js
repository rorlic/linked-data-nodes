const LdesClient = require("ldes-client");

module.exports = function(RED) {
  function LdesClientNode(config) {
    RED.nodes.createNode(this, config);
    this.config = {
      url: config.url, 
      urlIsView: config.isview, 
      materialize: config.materialize, 
      lastVersionOnly: config.onlylast
    };
    this.ordered = config.ordered;
    const node = this;
    (async () => {
      const done = node.done;
      try {
        const client = LdesClient.replicateLDES(node.config, node.ordered);
        const memberReader = client.stream({ highWaterMark: 10 }).getReader();
        let member = await memberReader.read();
        while (member) {
          node.send({ timestamp: Date.now(), payload: member || {} });
          member = await memberReader.read();
          if (member.done) {
            break;
          }
        }
        if (done) done();
      } catch (err) {
        if (done) {
          done(err);
        } else {
          node.error(err);
        }
      }
    })();
  }
  RED.nodes.registerType("ldes-client", LdesClientNode);
};