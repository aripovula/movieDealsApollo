module.exports = {
    Query: {
      movies: (_, __, { dataSources }) =>
        dataSources.movieAPI.getNowPlayingMovies(),
      movie: (_, { id }, { dataSources }) =>
        dataSources.movieAPI.getMovieById({ movieId: id }),
      me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
    }
  };

