import { useState, useEffect } from "react";
import Search from "./component/Search";
import Loader from "./component/Loader";
import MovieCard from "./component/MovieCard";
import { updateSearchCount, getTrendingMovies } from "../appwrite";

// TMDB API setup
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_API_KEY;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [errorMesage, setErrorMesage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Fetch movies from TMDB based on search query
  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMesage("");
    try {
      const URL = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(URL, options);
      if (!response.ok) throw new Error("Failed to fetch movie");

      const data = await response.json();
      if (data.Response === false) {
        setErrorMesage(data.Error || "Failed to fetch movie");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      setErrorMesage(`Error fetching Movie ${error}`);
      console.log(errorMesage);
    } finally {
      setIsLoading(false);
    }
  };

  // Load trending movies from Appwrite
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  // Fetch trending movies on initial render
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  // Update debouncedTerm 500ms after typing stops
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch movies when debouncedTerm changes
  useEffect(() => {
    fetchMovies(debouncedTerm);
  }, [debouncedTerm]);

  return (
    <>
      <div className="pattern">
        <div className="wrapper">
          {/* Header */}
          <header>
            <img src="./hero-img.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {/* Trending movies from Appwrite */}
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* All movies from TMDB */}
          <section className="all-movies">
            <h2>All Movies</h2>
            {isLoading ? (
              <Loader />
            ) : errorMesage ? (
              <p className="text-red-600 , text-3xl">{errorMesage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default App;
