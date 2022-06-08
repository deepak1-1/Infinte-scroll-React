import React, {useState, useRef, useCallback} from "react";
import useBookSearch from "./useBookSearch";

function App() {

    const [query, setQuery] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const { books, hasMore, error, loading } = useBookSearch(query, pageNumber);
    const observer = useRef();
    
    const lastBookElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(pageNumber => pageNumber + 1);
            }
        })
        if (node) observer.current.observe(node);
    }, [loading, hasMore])

    const handleSearch = (e) => {
        setQuery(e.target.value);
        setPageNumber(1);
    }

  return (
      <div className="container mt-5" >
          <input type="text" className="form-control my-2" placeholder="type book name" value={ query }onChange={handleSearch}/>
          {books.map((book, index) => {
              if (books.length === index + 1) {
                  return <div ref={lastBookElementRef} className="card" key={book}>
                            <div className="card-header">Book Name: {book}</div>
                        </div>;
              } else {
                  return <div  className="card" key={book}>
                            <div className="card-header">Book Name: {book}</div>
                        </div>;
              }
          })}
          <div>{ loading && 'Loading...'}</div>
          <div>{ error && 'Error...'}</div>
      </div>
  );
}

export default App;
