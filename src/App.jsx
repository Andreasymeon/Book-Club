import React, { useState, useEffect } from "react";
import BooksContainer from "./components/BooksContainer";
import Header from "./components/Header";
import DetailPanel from "./components/DetailPanel";
import Search from "./components/Search";
import { GlobalStyle } from "./styles";
import { Transition } from "react-transition-group";

const App = () => {
  // We use useState() to create a state variable
  // Arg1, the state value is - books, create an array called books to store the API response
  // Arg2, the setState value is - setBooks, is the function to update the response,
  // The default value is - empty array
  const [books, setBooks] = useState([]);
  // Arg1, the state value is - selectedBook,
  // Arg2, the setState value is - setSelectedBook, is the function to update the response,
  // The default value is - null as we wont have a selected book before user intercat with the page
  const [selectedBook, setSelectedBook] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  // Arg1, the state value is - filteredBooks, create an array called books to store filtered books list
  // Arg2, the setState value is - setFilteredBooks, is the function to update the response,
  // The default value is - empty array
  const [filteredBooks, setFilteredBooks] = useState([]);

  // We use use useEffect() to fetch our data and store it in a state variable
  useEffect(() => {
    // fetchData creates an async function that returns promises inside useEffect function otherwise it would return a promise
    const fetchData = async () => {
      // Save fetch request to variable response
      const response = await fetch(
        "https://book-club-json.herokuapp.com/books"
      );
      // Convert json object to JS object stored in the variable books
      const books = await response.json();
      // Call setBooks function to update the books array
      setBooks(books);
      // Call setFilteredBooks to show full list of book when arriving on page
      setFilteredBooks(books);
    };
    // Function called immediatly after the function
    // Because useEffect ecpects to return nothing or a cleanup function
    fetchData();
  }, []);

  // Helper function triggered when user clicks on a book
  // Takes an object called book as an argument
  const pickBook = (book) => {
    setSelectedBook(book);
    setShowPanel(true);
  };

  // Helper function triggered when user close panel
  // Takes null as an argument
  const closePanel = () => {
    setShowPanel(false);
  };

  // Filter books logic - Compare the user's search term against our book data and show matches
  // stringSearch  - performs a case sensitive search of a string against an other
  // If no terms is found return the entire list
  // Else compare the search to each book's title and author anf save matches in new list
  const filterBooks = (searchTerm) => {
    const stringSearch = (bookAttribute, searchTerm) =>
      bookAttribute.toLowerCase().includes(searchTerm.toLowerCase());

    if (!searchTerm) {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(
        books.filter(
          (book) =>
            stringSearch(book.title, searchTerm) ||
            stringSearch(book.author, searchTerm)
        )
      );
    }
  };

  const hasFiltered = filteredBooks.length !== books.length;

  return (
    <>
      <GlobalStyle />
      <Header>
        <Search filterBooks={filterBooks} />
      </Header>
      <BooksContainer
        books={filteredBooks}
        pickBook={pickBook}
        isPanelOpen={showPanel}
        title={hasFiltered ? "Search results" : "All books"}
      />
      <Transition in={showPanel} timeout={300}>
        {(state) => (
          <DetailPanel
            book={selectedBook}
            closePanel={closePanel}
            state={state}
          />
        )}
      </Transition>
    </>
  );
};

export default App;
