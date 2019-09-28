const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    movies(
      pageSize: Int
      after: String
    ): MovieConnection!
    movie(id: ID!): Movie
    me: User
  }

  type Mutation {
    # if false, signup failed -- check errors
    bookTrips(movieIds: [ID]!): TripUpdateResponse!

    # if false, cancellation failed -- check errors
    cancelTrip(movieId: ID!): TripUpdateResponse!

    login(email: String): String # login token
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    movies: [Movie]
  }

  """
  Simple wrapper around our list of movies that contains a cursor to the
  last item in the list. Pass this cursor to the movies query to fetch results
  after these.
  """
  type MovieConnection {
    cursor: String!
    hasMore: Boolean!
    movies: [Movie]!
  }

  type Movie {
    id: ID!
    name: String
    genre: Genre
    financialData: FinancialData
    isAdult: Boolean!
  }

  type FinancialData {
    revenue: String
    budget: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Movie]!
  }

  type Genre {
    id: ID!
    name: String
  }

`;

module.exports = typeDefs;
