const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Define GraphQL schema
const schema = buildSchema(`
  type Query {
    hello: String
    greet(name: String!): String
  }
`);

// Define resolvers
const root = {
  hello: () => {
    return 'Hello, GraphQL!';
  },
  greet: ({ name }) => {
    return `Hello, ${name}!`;
  },
};

// Create Express app
const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enables GraphiQL IDE at /graphql
}));

// Start the server
app.listen(4000, () => {
  console.log('🚀 Server running at http://localhost:4000/graphql');
});
