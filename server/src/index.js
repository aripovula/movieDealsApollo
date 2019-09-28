const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');

const MovieAPI = require('./datasources/movie');
const UserAPI = require('./datasources/user');

const store = createStore();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    movieAPI: new MovieAPI(),
    userAPI: new UserAPI({ store })
  })
});

const dotenv = require('dotenv');
console.log('DOTENV - ', dotenv);

dotenv.config({
  path: './.env'
});
console.log(`Your TMDb_API_KEY222 is ${process.env.TMD_API_KEY}`); // 8626


server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});