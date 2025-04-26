const GraphQLJSON = require('graphql-type-json');

const {PipeIn, PipeOut} = require('./pipeLine');


//Establishing connection to Kafka
async function init() {
    try {
      await PipeIn.connect();
      console.log('🚀 Input PipeLine connected');
      await PipeOut.connect();
      console.log('🚀 Output PipeLine connected');
    } catch (err) {
      console.error('Connection failed:', err.message);
    }
  }
init();



const root = {
    JSON: GraphQLJSON,
    getDynamicInfo: async (args, context) => {
      const { req, res } = context;
  
      const clientIP = req.ip;
      const customHeader = req.headers['x-custom-header'];
  
      return {
        name: "Sudharsan",
        ip: clientIP,
        header: customHeader || "Header not set",
        timestamp: new Date().toISOString()
      };
    }
  };

module.exports = root;