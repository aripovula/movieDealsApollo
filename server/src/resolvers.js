const { paginateResults } = require('./utils');

module.exports = {
    Query: {
      movies: (_, __, { dataSources }) =>
        dataSources.movieAPI.getNowPlayingMovies(),
      movie: (_, { id }, { dataSources }) =>
        dataSources.movieAPI.getMovieById({ movieId: id }),
      me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
      moviesPg: async (_, { pageSize = 20, after }, { dataSources }) => {
        const allMovies = await dataSources.movieAPI.getNowPlayingMovies();
        // we want these in reverse chronological order
        allMovies.reverse();

        const movies = paginateResults({
          after,
          pageSize,
          results: allMovies,
        });

        console.log('movies - ', movies);

        return {
          movies,
          cursor: movies.length ? movies[movies.length - 1].cursor : null,
          // if the cursor of the end of the paginated results is the same as the
          // last item in _all_ results, then there are no more results after this
          hasMore: movies.length
            ? movies[movies.length - 1].cursor !==
              allMovies[allMovies.length - 1].cursor
            : false,
        };
      },
    }
  };

