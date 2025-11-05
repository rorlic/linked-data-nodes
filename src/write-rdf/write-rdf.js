const N3 = require('n3');

module.exports = function(RED) {
  function WriteRdfNode(config) {
    RED.nodes.createNode(this, config);
    this.config = {...config};
    const node = this;
    node.on('input', (msg, send, done) => {
      send = send || function() { node.send.apply(node, arguments); }; // Compatibility fallback
      try {
        const writer = new N3.Writer({ format: node.config.format, prefixes: msg.prefixes })
        writer.addQuads(msg.payload);
        writer.end((error, result) => {
          if (error) {
            if (done) {
              done(error);
            } else {
              node.error(error, msg);
            }
          } else {
            msg.payload = result;
            send(msg);
            if (done) done();
          }
        });
      } catch (err) {
        if (done) {
          done(err);
        } else {
          node.error(err, msg);
        }
      }
    });
  }

  RED.nodes.registerType("write-rdf", WriteRdfNode);
};