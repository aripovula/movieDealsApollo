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
    },
    Mutation: {
      bookTrips: async (_, { movieIds }, { dataSources }) => {
        const results = await dataSources.userAPI.bookTrips({ movieIds });
        const movies = await dataSources.movieAPI.getMoviesByIds({
          movieIds,
        });

        return {
          success: results && results.length === movieIds.length,
          message:
            results.length === movieIds.length
              ? 'trips booked successfully'
              : `the following movies couldn't be booked: ${movieIds.filter(
                  id => !results.includes(id),
                )}`,
          movies,
        };
      },
      cancelTrip: async (_, { movieId }, { dataSources }) => {
        const result = dataSources.userAPI.cancelTrip({ movieId });

        if (!result)
          return {
            success: false,
            message: 'failed to cancel trip',
          };

        const movie = await dataSources.movieAPI.getMovieById({ movieId });
        return {
          success: true,
          message: 'trip cancelled',
          movies: [movie],
        };
      },
      login: async (_, { email }, { dataSources }) => {
        const user = await dataSources.userAPI.findOrCreateUser({ email });
        if (user) return new Buffer(email).toString('base64');
      },
    },
    Movie: {
      isBooked: async (movie, _, { dataSources }) =>
        dataSources.userAPI.isBookedOnMovie({ movieId: movie.id }),
    },
    // Mission: {
    //   // make sure the default size is 'large' in case user doesn't specify
    //   missionPatch: (mission, { size } = { size: 'LARGE' }) => {
    //     return size === 'SMALL'
    //       ? mission.missionPatchSmall
    //       : mission.missionPatchLarge;
    //   },
    // },
    User: {
      trips: async (_, __, { dataSources }) => {
        // get ids of movies by user
        const movieIds = await dataSources.userAPI.getMovieIdsByUser();

        if (!movieIds.length) return [];

        // look up those movies by their ids
        return (
          dataSources.movieAPI.getMoviesByIds({
            movieIds,
          }) || []
        );
      },
    },
  };

/* Query for 2 types - 1st -> paginated movies, second -> fetch all movies
query GetMovie {
  
    moviesPg(pageSize:8, after: "384018"){
    cursor
    hasMore
      movies{
        id
        name
        genre{
          id
        }
      }
    }
  movies{
    name
  }
}
*/