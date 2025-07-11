import { useState, useEffect } from "react";
import Search from "./component/search";
import Loader from "./component/loader";
import MovieCard from "./component/MovieCard";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMesage, setErrorMesage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");
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
      console.log(data);
      if (data.Response === false) {
        setErrorMesage(data.Error || "Failed to fetch movie");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    } catch (error) {
      setErrorMesage(`Error fetching Movie ${error}`);
      console.log(errorMesage);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchMovies(debouncedTerm);
  }, [debouncedTerm]);
  return (
    <>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          <section className="all-movies">
            <h2>Trending Movies</h2>
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
            <p className="text-red-600 , text-3xl">{errorMesage}</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default App;
