import React, { useEffect, useState } from "react";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { Books } from "../components/Books";
import { SearchBar } from "../components/SearchBar";
import ViewAsContainer from "../components/common/ViewAs/ViewAsContainer";
import { fetchBooks } from "../Store/actions";
import ScrollToTop from "../components/common/ScrollToTop";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px 10px 10px 10px",
  },
}));

const BooksView = () => {
  const books = useSelector((state) => state.books.books);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(books);
  const dispatch = useDispatch();
  const classes = useStyles();
  const total = books.length;

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  useEffect(() => {
    setFilteredBooks(
      books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [books, searchTerm]);

  const searchChangeHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  return (
    <Box component="div" className={classes.root}>
      <ScrollToTop showBelow={250} />
      <SearchBar onSearch={searchChangeHandler} />
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <ViewAsContainer />
        <Box marginLeft={"auto"}>
          <Typography
            variant="body1"
            component="span"
            tabIndex={0}
            aria-label={`${total} total books`}
          >
            {total} books
          </Typography>
        </Box>
      </Grid>
      <Books books={filteredBooks} />
    </Box>
  );
};

export default BooksView;
