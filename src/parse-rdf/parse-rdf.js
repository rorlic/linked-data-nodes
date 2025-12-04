const N3 = require('n3');

module.exports = function(RED) {
  function ParseRdfNode(config) {
    RED.nodes.createNode(this, config);
    this.config = {...config};
    const node = this;
    node.on('input', (msg, send, done) => {
      send = send || function() { node.send.apply(node, arguments); }; // Compatibility fallback
      try {
        const settings = {format: node.config.format, baseIRI: node.config.baseIRI }
        const parser = new N3.Parser(settings);
        const quads = [];
        parser.parse(msg.payload, (error, quad, prefixes) => {
          if (error) {
            // Report error back to runtime
            if (done) {
              done(error);
            } else {
              node.error(error, msg);
            }
            return;
          }
          if (quad) {
            quads.push(quad);
          } else {
            // parsing done (quad==null indicates end)
            msg.payload = quads;
            msg.prefixes = prefixes;
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

  RED.nodes.registerType("parse-rdf", ParseRdfNode);
};