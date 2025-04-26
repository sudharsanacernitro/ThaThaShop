const GraphQLJSON = require('graphql-type-json');

const root = {
  JSON: GraphQLJSON,
  getDynamicInfo: async () => {

    // return {
    //   name: "Sudharsan",
    //   age: 23,
    //   location: {
    //     city: "Chennai",
    //     lat: 13.08,
    //     lng: 80.27,
    //   },
    //   skills: ["Node.js", "Kafka", "Docker"],
    //   timestamp: new Date().toISOString()
    // };

    
    
  }
};

module.exports = root;