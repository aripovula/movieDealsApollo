const { RESTDataSource } = require('apollo-datasource-rest');

const dotenv = require('dotenv');
console.log('DOTENV - ', dotenv);

dotenv.config({
  path: '../../.env'
});
// console.log(`Your TMDb_API_KEY is ${process.env.TMD_API_KEY}`); // 8626

class MovieAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMD_API_KEY}&language=en-US&page=1`
                 // https://api.themoviedb.org/3/movie/movies
    // https://api.themoviedb.org/3/movie/550?api_key=${process.env.TMD_API_KEY}';
  }

  // all genres
  // https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMD_API_KEY}&language=en-US

  // upcoming movies
  // https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMD_API_KEY}&language=en-US&page=1

  // now playing videos
  // https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMD_API_KEY}&language=en-US&page=10

  // leaving this inside the class to make the class easier to test
  movieReducer(movie) {
    // console.log('CCC genre - ', movie.genres[0]);
    console.log('BBB movie - ', movie);
    return {
      id: movie.id || 0,
      cursor: movie.id.toString(),
      name: movie.title,
      genre: {
        id: movie.genres && movie.genres.map(item => item['id']).toString(),
        name: movie.genres && movie.genres.map(item => item['name']).toString()
        ,
      },
      financialData: {
        revenue: movie.revenue,
        budget: movie.budget,
      },
      isAdult: movie.adult
    };
  }

  moviesReducer(movie) {
    // console.log('CCC genre - ', movie.genres[0]);
    // console.log('BBB2 movie - ', movie);
    return {
      id: movie.id.toString() || '0',
      cursor: movie.id.toString(),
      name: movie.title,
      genre: {
        id: movie.genre_ids.toString(),
        name: null
        ,
      },
      financialData: {
        revenue: null,
        budget: null,
      },
      isAdult: movie.adult
    };
  }

  // https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMD_API_KEY}&language=en-US&page=10

  async getNowPlayingMovies() {
    console.log('in getNowPlayingMovies');
    // const response = await this.get(`now_playing?api_key=${process.env.TMD_API_KEY}&language=en-US&page=1`);
    const response = await this.get( `/now_playing?api_key=${process.env.TMD_API_KEY}&language=en-US&page=1`);
    // console.log('response - ', response.results[0]);
    // transform the raw movies to a more friendly
    const retVal = Array.isArray(response.results)
    // return Array.isArray(response.results)
      // ? response.results.map(movie => {console.log('movieABC-', movie, ' reduced-', this.moviesReducer(movie)); this.moviesReducer(movie)}) : [];
      ? response.results.map(movie => this.moviesReducer(movie)) : [];
      // console.log('retVal - ', retVal);
      
      return retVal;
  }

  // "https://api.themoviedb.org/3/movie/552?api_key=KEY",

  async getMovieById({ movieId }) {
    console.log('process.env.TMD_API_KEY = ', process.env.TMD_API_KEY);
    
    const res = await this.get( movieId , `&api_key=${process.env.TMD_API_KEY}`);
    // console.log('AAAAA res= ', res);
    
    return res != null ? this.movieReducer(res) : '';
  }

  async getMoviesByIds({ movieIds }) {
    return Promise.all(
      movieIds.map(movieId => this.getMovieById({ movieId })),
    );
  }
}

module.exports = MovieAPI;
