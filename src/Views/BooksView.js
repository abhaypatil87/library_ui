import React, { useEffect, useState } from "react";
import { Box, makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";

import { Books } from "../components/Books";
import { SearchBar } from "../components/SearchBar";
import ViewAsContainer from "../components/common/ViewAs/ViewAsContainer";
import { fetchBooks } from "../Store/actions";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px 10px 10px 10px",
  },
}));

const BooksView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(fetchBooks());
    return () => {
      console.log("BooksView is being unmounted");
    };
  }, [dispatch]);

  useEffect(() => {}, [searchTerm]);

  const searchChangeHandler = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };

  return (
    <Box component="div" className={classes.root}>
      <SearchBar onSearch={searchChangeHandler} />
      <ViewAsContainer />
      <Books />
    </Box>
  );
};

export default BooksView;
