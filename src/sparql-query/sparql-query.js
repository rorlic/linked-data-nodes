const Store = require('n3').Store;
const QueryEngine = require('@comunica/query-sparql').QueryEngine;

module.exports = function(RED) {
  function SparqlQueryNode(config) {
    RED.nodes.createNode(this, config);
    this.query = config.query;
    const node = this;
    node.on('input', async (msg, send, done) => {
      send = send || function() { node.send.apply(node, arguments); }; // Compatibility fallback
      try {
        const store = new Store(msg.payload);
        const engine = new QueryEngine();
        const stream = await engine.queryQuads(node.query, { sources:[ store ]});
        msg.payload = await stream.toArray();
        send(msg);
        if (done) done();
      } catch (err) {
        if (done) {
          done(err);
        } else {
          node.error(err, msg);
        }
      }
    });
  }

  RED.nodes.registerType("sparql-query", SparqlQueryNode);
};