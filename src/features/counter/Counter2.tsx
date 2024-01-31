import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { legacy_createStore } from "@reduxjs/toolkit";
import { Provider, connect } from "react-redux";

// 使用connect方式来连接redux

const increment = () => {
  return {
    type: "increment",
  };
};

const decrement = () => {
  return {
    type: "decrement",
  };
};

const counter = (state = 0, action: any) => {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    default:
      return state;
  }
};

const store = legacy_createStore(counter);

function Counter2(props: any) {
  return (
    <Provider store={store}>
      <Box display="flex" p={1}>
        <Button
          variant="contained"
          sx={{ margin: 1 }}
          onClick={() => props.decrement()}
        >
          -
        </Button>
        <Typography variant="h3">{props.count}</Typography>
        <Button
          variant="contained"
          sx={{ margin: 1 }}
          onClick={() => props.increment()}
        >
          +
        </Button>
      </Box>
    </Provider>
  );
}

const mapStateToProps = (state: any) => {
  return {
    count: state,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
  };
};

const connectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter2);

export function CounterWrapped() {
  return (
    <Provider store={store}>{React.createElement(connectedCounter)}</Provider>
  );
}
