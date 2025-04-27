const GraphQLJSON = require('graphql-type-json');

const {PipeIn, PipeOut} = require('./pipeLine');


//Establishing connection to Kafka
async function init() {
    try {
      await PipeIn.connect();
      console.log('🚀 Input PipeLine connected');
      await PipeOut.connect();
      await consumer.subscribe({ topic: 'Response', fromBeginning: true });
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
  
      // Access 'input' correctly from args
      const { service , input } = args;
    
      const clientIP = req.ip;
      const customHeader = req.headers['x-custom-header'];
    
      const data ={
        name: "Sudharsan",
        ip: clientIP,
        header: customHeader || "Header not set",
        timestamp: new Date().toISOString(),
        body: input, // This is the data passed in from the query
        service: service,
      };

      await PipeIn.send({
        topic: `Request-${service}`, 
        messages: [
          { value: JSON.stringify(input) },
        ],
      }).then(() => {



      }).catch((err) => {
        console.error('Error sending message:', err);
      }
      );
    
      console.log("✅ Message sent successfully");

      return data;
    }
  };
  
  

module.exports = root;