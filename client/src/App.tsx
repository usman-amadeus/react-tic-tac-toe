import React from "react";
import axios from "axios";
import "./App.css";

function TicTacToe() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic tact toe</h1>
      </header>
      <div className="content">
        <Game />
        <button onClick={hitBackend}>Send request</button>
      </div>
      <div className="footer"></div>
    </div>
  );
}

const hitBackend = () => {
  axios.get("/test").then((response) => {
    console.log(response.data);
  });
};

function clone(x: []) {
  return JSON.parse(JSON.stringify(x));
}

const NEXT_TURN: any = {
  O: "X",
  X: "O",
};

function generateGrid(rows: number, columns: number, mapper: any) {
  return Array(rows)
    .fill(null)
    .map(() => Array(columns).fill(null).map(mapper));
}

const flattenGrid = (arr: any) =>
  arr.reduce((acc: [], cur: any) => [...acc, ...cur], []);

const newTicTacToeGrid = () => {
  return generateGrid(3, 3, () => null);
};

function checkForThree(a: string, b: string, c: string) {
  if (!a || !b || !c) {
    return false;
  }

  return a === b && b === c;
}

function checkForWin(flatGrid: any) {
  const [nw, n, ne, w, c, e, sw, s, se] = flatGrid;

  return (
    checkForThree(nw, n, ne) ||
    checkForThree(w, c, e) ||
    checkForThree(sw, s, se) ||
    checkForThree(nw, w, sw) ||
    checkForThree(n, c, s) ||
    checkForThree(ne, e, se) ||
    checkForThree(nw, c, se) ||
    checkForThree(ne, c, sw)
  );
}

function checkForDraw(flatGrid: any) {
  return (
    !checkForWin(flatGrid) &&
    flatGrid.filter(Boolean).length === flatGrid.length
  );
}

const getInitialState = () => ({
  grid: newTicTacToeGrid(),
  status: "inProgress",
  turn: "X",
});
const reducer = (state: any, action: any) => {
  if (state.status === "success" && action.type !== "RESET") {
    return state;
  }
  switch (action.type) {
    case "RESET": {
      return getInitialState();
    }
    case "CLICK": {
      const { x, y } = action.payload;
      const { grid, turn } = state;

      if (grid[x][y]) {
        return state;
      }

      const nextState = clone(state);

      nextState.grid[x][y] = turn;
      const flatGrid = flattenGrid(nextState.grid);
      if (checkForWin(flatGrid)) {
        nextState.status = "success";
        return nextState;
      }

      if (checkForDraw(flatGrid)) {
        return getInitialState();
      }
      nextState.turn = NEXT_TURN[turn];

      return nextState;
    }
    default:
      return state;
  }
};
function Game() {
  const [state, dispatch] = React.useReducer(reducer, getInitialState());

  const handleClick = (x: number, y: number) => {
    dispatch({ type: "CLICK", payload: { x, y } });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  const { grid, status, turn } = state;

  return (
    <div style={{ display: "inline-block" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Next turn: {turn}</div>
        <div>Status: {status === "success" ? `${turn} won!` : null}</div>
        <button onClick={reset} type="button">
          {" "}
          Reset
        </button>
      </div>
      <div>
        <Grid grid={grid} handleClick={handleClick} />
      </div>
    </div>
  );
}

function Grid({ grid, handleClick }: any) {
  return (
    <div style={{ display: "inline-block" }}>
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridGap: 2,
          backgroundColor: "#444",
        }}
      >
        {grid.map((row: any, rowIdx: number) =>
          row.map((value: string, colIdx: number) => (
            <Cell
              key={`${colIdx} - ${rowIdx}`}
              value={value}
              onClick={() => {
                handleClick(rowIdx, colIdx);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Cell({ value, onClick }: any) {
  return (
    <div
      style={{
        width: 100,
        height: 100,
        backgroundColor: "#fff",
      }}
    >
      <button
        style={{
          width: "100%",
          height: "100%",
        }}
        type="button"
        onClick={onClick}
      >
        {value}
      </button>
    </div>
  );
}
export default TicTacToe;
