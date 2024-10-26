import { useState } from "react";
import WatchedMovieList from "./WatchedMovieList";
import WatchedSummary from "./WatchedSummary";
import MovieDetails from "./MovieDetails";
import MovieList from "./MovieList";
import ListBox from "./ListBox";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import NavBar from "./NavBar";
import Main from "./Main";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "64100630";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);

  const { movies, isLoading, error } = useMovies(query, page);

  const [watched, setWatched] = useLocalStorage([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWathed(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar
        setQuery={setQuery}
        query={query}
        movies={movies}
        setPage={setPage}
      />

      <Main>
        <ListBox>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <>
              <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
            </>
          )}
          {error && <ErrorMessage message={error} />}
          <div className="buttons">
            {page !== 1 ? (
              <button onClick={() => setPage(page - 1)}>&larr;</button>
            ) : (
              <button className="placeholder"></button>
            )}
            {(page !== 1 || movies.length !== 0) && <p>page {page}</p>}
            {movies.length === 10 ? (
              <button onClick={() => setPage(page + 1)}>&rarr;</button>
            ) : (
              <button className="placeholder"></button>
            )}
          </div>
        </ListBox>

        <ListBox>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWathed}
              watched={watched}
              key={selectedId}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </ListBox>
      </Main>
    </>
  );
}
