import { useState, useEffect } from "react";
import Search from "./component/search";
import Loader from "./component/loader";
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
  // App states
  const [searchTerm, setSearchTerm] = useState("");         // User's input value
  const [debouncedTerm, setDebouncedTerm] = useState("");   // Debounced version of searchTerm
  const [errorMesage, setErrorMesage] = useState("");       // Error display
  const [movieList, setMovieList] = useState([]);           // List of movies based on searchTerm
  const [isLoading, setIsLoading] = useState(false);        // Loader toggle
  const [trendingMovies, setTrendingMovies] = useState([]); // Trending movies from Appwrite

  // Fetch movies from TMDB API based on the query
  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMesage("");

    try {
      const URL = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(URL, options);

      if (!response.ok) {
        throw new Error("Failed to fetch movie");
      }

      const data = await response.json();

      if (data.Response === false) {
        setErrorMesage(data.Error || "Failed to fetch movie");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      // Update search count in Appwrite if query is present and results exist
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

  // Load top trending movies from Appwrite (based on search count)
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  // Run once to load trending movies
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  // Debounce input: wait 500ms after user stops typing to update search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    // Cleanup timeout on re-render
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch movies when debouncedTerm changes
  useEffect(() => {
    fetchMovies(debouncedTerm);
  }, [debouncedTerm]);

  return (
    <>
      <div className="pattern">
        <div className="wrapper">
          {/* App header */}
          <header>
            <img src="./hero-img.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {/* Trending Movies Section */}
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

          {/* Search/All Movies Section */}
          <section className="all-movies">
            <h2>All Movies</h2>
            {isLoading ? (
              <Loader />
            ) : errorMesage ? (
              <p className="text-red-600 text-3xl">{errorMesage}</p>
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
