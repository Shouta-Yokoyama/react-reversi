import { render, screen } from "@testing-library/react";
import React from "react";
import Grid from "../components/Grid";
import Square from "../components/Square";
import { BoardContext } from "../contexts/BoardContext";

jest.mock("../components/Square");

const mockContext = {
  boardState: Array(8).fill(Array(8).fill(0)),
  handleClick: jest.fn(),
};

const renderGrid = () => {
  return render(
    <BoardContext.Provider value={mockContext}>
      <Grid />
    </BoardContext.Provider>
  );
};

describe("Grid component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a grid", ()=>{
    renderGrid();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("grid has a 8 rows", ()=> {
    renderGrid();
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(8);
  });


  it("grid has a 64 squares", ()=> {
    renderGrid();
    const square = Square as jest.Mock;
    expect(square.mock.calls).toHaveLength(64);
  });

});
