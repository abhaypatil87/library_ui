import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import EditRoundedIcon from "@material-ui/icons/EditRounded";

import {
  formsReducer,
  isValidForm,
  onFocusOut,
  onInputChange,
  RESET_FORM,
} from "../../utils/formUtil";
import { FormError, SnackBar } from "../common";
import useAlert from "../../utils/hooks/useAlert";
import { editAuthor } from "../../Store/actions";
import { ERROR, SUCCESS } from "../../utils/crud";

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: "baseline",
  },
  hover: {
    cursor: "pointer",
  },
  iconButton: {
    "&:hover": {
      color: "#2158d0",
    },
  },
  nameBox: {
    alignItems: "center",
    display: "inherit",
  },
}));

const getInitialState = (props) => {
  return {
    first_name: {
      value: props.first_name,
      touched: false,
      hasError: true,
      error: "",
    },
    last_name: {
      value: props.last_name,
      touched: false,
      hasError: true,
      error: "",
    },
    isFormValid: false,
  };
};

const Author = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(
    `${props.first_name} ${props.last_name}`
  );
  const [formState, dispatchForm] = useReducer(
    formsReducer,
    getInitialState(props)
  );
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notifications.notification);
  const { error, setError, showError, setShowError } = useAlert();
  const classes = useStyles();

  useEffect(() => {
    setEditMode(false);
    setIsEditing(false);
    if (notification !== null) {
      if (notification.status === ERROR) {
        resetForm();
        setFullName(`${props.first_name} ${props.last_name}`);
      } else if (notification.status === SUCCESS) {
        setFullName(
          `${formState.first_name.value} ${formState.last_name.value}`
        );
      }
    }
  }, [notification]);

  const editClickHandler = async (event) => {
    event.preventDefault();
    if (!isValidForm(formState, dispatchForm)) {
      setShowError(true);
      setError("Please address all the highlighted errors.");
    } else {
      setIsEditing(true);
      dispatch(
        editAuthor({
          author_id: props.author_id,
          first_name: formState.first_name.value,
          last_name: formState.last_name.value,
        })
      );
    }
  };

  /*
   * Utility methods
   */
  const resetForm = () => {
    dispatchForm({
      type: RESET_FORM,
      data: getInitialState(props),
    });
  };
  const enableEdit = () => setEditMode(true);
  const cancelEdit = () => {
    setEditMode(false);
    resetForm();
  };
  const handleErrorAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowError(false);
    setError("");
  };

  return (
    <Box marginTop={2}>
      <SnackBar
        message={error}
        open={showError}
        severity={"error"}
        onClose={handleErrorAlertClose}
      />
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        container
        className={classes.container}
      >
        <Grid container spacing={1}>
          {!editMode && (
            <Box hidden={editMode} className={classes.nameBox}>
              <Typography variant="body1" tabIndex={0}>
                {fullName}
              </Typography>
              <IconButton
                size="medium"
                onClick={enableEdit}
                className={`${classes.iconButton} ${classes.hover}`}
                aria-label={"Edit"}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Grid>
        <Fade in={editMode} timeout={1} unmountOnExit>
          <>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  autoFocus={true}
                  margin="dense"
                  variant="standard"
                  type="text"
                  data-testid="firstname"
                  title="First Name"
                  name="firstname"
                  value={formState.first_name.value}
                  onChange={(event) => {
                    onInputChange(
                      "first_name",
                      event.target.value,
                      dispatchForm,
                      formState
                    );
                  }}
                  onBlur={(event) => {
                    onFocusOut(
                      "first_name",
                      event.target.value,
                      dispatchForm,
                      formState
                    );
                  }}
                />
                {formState.first_name.touched &&
                  formState.first_name.hasError && (
                    <FormError error={formState.first_name.error} />
                  )}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  margin="normal"
                  variant="standard"
                  type="text"
                  title="Last Name"
                  name="lastname"
                  value={formState.last_name.value}
                  onChange={(event) => {
                    onInputChange(
                      "last_name",
                      event.target.value,
                      dispatchForm,
                      formState
                    );
                  }}
                  onBlur={(event) => {
                    onFocusOut(
                      "last_name",
                      event.target.value,
                      dispatchForm,
                      formState
                    );
                  }}
                />
                {formState.last_name.touched &&
                  formState.last_name.hasError && (
                    <FormError error={formState.last_name.error} />
                  )}
              </Grid>
            </Grid>
          </>
        </Fade>
        <Grid item xs={12} sm={12} md={12} lg={12} hidden={!editMode}>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            disabled={isEditing}
            aria-disabled={isEditing}
            type="button"
            value="Edit"
            size="small"
            onClick={editClickHandler}
          >
            Edit
          </Button>
          <Button
            style={{ marginLeft: "6px" }}
            size="small"
            variant="outlined"
            onClick={cancelEdit}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Author;
