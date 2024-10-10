import { render } from "@testing-library/react";
import React from "react";
import Grid from "../components/Grid";
import { BoardContext } from "../contexts/BoardContext";

const mockContext = {
  boardState: Array(8).fill(Array(8).fill(0)),
  handleClick: jest.fn(),
};

const renderGrid = ()=> {
    return render(
        <BoardContext.Provider value={mockContext}>
            <Grid />
        </BoardContext.Provider>
    );
};