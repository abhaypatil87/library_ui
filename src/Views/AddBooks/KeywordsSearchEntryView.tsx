import React, { FormEvent, useEffect, useReducer, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Box, TextField } from "@material-ui/core";

import {
  formsReducer,
  isValidForm,
  onFocusOut,
  onInputChange,
  RESET_FORM,
} from "../../utils/formUtil";
import { SERVER, Status } from "../../utils/crud";
import { FormError, SnackBar } from "../../components/common";
import useAlert from "../../utils/hooks/useAlert";
import { useSelector } from "react-redux";

import { ListStyleBookTile } from "../../components/Books";
import { RequestHeader } from "../../utils/RequestHeader";
import { LibButton } from "../../components/common/LibButton";
import { BookType } from "../../declarations";
import { RootState } from "../../Store/store";

const useStyles = makeStyles({
  form: {
    width: "40rem",
  },
});

const initialState = {
  keywords: { value: "", touched: false, hasError: true, error: "" },
  isFormValid: false,
};

const KeywordsSearchEntryView = () => {
  const [formState, dispatchForm] = useReducer(formsReducer, initialState);
  const [foundBooks, setFoundBooks] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const notification = useSelector(
    (state: RootState) => state.notifications.notification
  );
  const classes = useStyles();
  const [error, setError] = useState("Please enter keywords to search");
  const { showError, setShowError } = useAlert();

  useEffect(() => {
    if (notification !== null) {
      if (notification.lastOp === "ADD_BOOK") {
        if (notification.status === Status.SUCCESS) {
          dispatchForm({
            type: RESET_FORM,
            data: initialState,
          });
        }
      }
    }
  }, [notification]);
  const formSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    if (!isValidForm(formState, dispatchForm)) {
      setShowError(true);
      setError("Please address all the highlighted errors.");
    } else {
      await fetchBooksByKeywords();
    }
  };

  const fetchBooksByKeywords = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `${SERVER}/api/books?keywords=${formState.keywords.value}`,
        {
          headers: new RequestHeader().addAuthorisation().getHeader(),
        }
      );
      const result = await response.json();
      setFoundBooks(result.data.books);
    } catch (error) {
      setShowError(true);
      setError(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleErrorAlertClose = () => {
    setShowError(false);
    setError("");
  };

  return (
    <Grid container={true} direction={"column"}>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <SnackBar
          message={error}
          open={showError}
          severity={"error"}
          onClose={handleErrorAlertClose}
        />
        <form
          className={`${classes.form}`}
          onSubmit={(event) => formSubmitHandler(event)}
        >
          <Box component="div">
            <TextField
              label="Keywords"
              variant="outlined"
              fullWidth
              margin="dense"
              type="text"
              name="keywords"
              value={formState.keywords.value}
              onChange={(event) => {
                onInputChange(
                  "keywords",
                  event.target.value,
                  dispatchForm,
                  formState
                );
              }}
              onBlur={(event) => {
                onFocusOut(
                  "keywords",
                  event.target.value,
                  dispatchForm,
                  formState
                );
              }}
            />
            {formState.keywords.touched && formState.keywords.hasError && (
              <FormError error={formState.keywords.error} />
            )}
          </Box>
          <LibButton
            variant="contained"
            color="primary"
            disabled={isSearching}
            aria-disabled={isSearching}
            disableElevation
            type="submit"
            value="search"
          >
            Search
          </LibButton>
        </form>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        {foundBooks.map((book: BookType) => (
          <ListStyleBookTile
            key={book.book_id}
            book_id={book.book_id}
            title={book.title}
            subtitle={book.subtitle}
            thumbnail_url={book.thumbnail_url}
            isbn_10={book.isbn_10}
            isbn_13={book.isbn_13}
            page_count={book.page_count}
            author={book.author}
            description={book.description}
          />
        ))}
      </Grid>
    </Grid>
  );
};

export default KeywordsSearchEntryView;
