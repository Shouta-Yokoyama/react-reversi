import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Square from "../components/Square";
import { BoardContext } from "../contexts/BoardContext";
import { SquareProps } from "../types";
// モックコンテキストのセットアップ
const mockContext = {
  boardState: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, -1, 0, 0, 0],
    [0, 0, 0, -1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  handleClick: jest.fn(),
};

const renderSquare = (props: SquareProps) => {
  return render(
    <BoardContext.Provider value={mockContext}>
      <Square posX={props.posX} posY={props.posY} state={props.state} key={props.key} />
    </BoardContext.Provider>
  );
};

describe("Square Component", () => {
  afterEach(() => {
    jest.clearAllMocks(); // モック関数のリセット
  });

  it("renders a black circle when state is 1", () => {
    renderSquare({ posX: 1, posY: 1, state: 1, key: 0 });

    const blackCircle = screen.getByTestId("circle-black");
    expect(blackCircle).toBeInTheDocument();
    expect(blackCircle).toHaveClass("bg-black");
  });

  it("renders a white circle when state is -1", () => {
    renderSquare({ posX: 1, posY: 1, state: -1, key: 0 });

    const whiteCircle = screen.getByTestId("circle-white");
    expect(whiteCircle).toBeInTheDocument();
    expect(whiteCircle).toHaveClass("bg-white");
  });

  it("does not render any circle when state is 0", () => {
    renderSquare({ posX: 1, posY: 1, state: 0, key: 0 });

    expect(screen.queryByTestId("circle-black")).not.toBeInTheDocument();
    expect(screen.queryByTestId("circle-white")).not.toBeInTheDocument();
  });

  it("calls context handleClick on button click", () => {
    renderSquare({ posX: 1, posY: 1, state: 0, key: 0 });

    // ボタンクリック時にhandleClickが呼ばれることを確認
    const button = screen.getByTestId("square-button"); // buttonをdata-testidで取得
    fireEvent.click(button);
    expect(mockContext.handleClick).toHaveBeenCalled();
  });

  it("throws an error if used outside of BoardContext", () => {
    // コンテキストプロバイダがない場合にエラーが投げられることを確認
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Square state={0} posX={0} posY={0} key={0} />)).toThrow(
      "BoardContext must be used within a Context.Provider"
    );
    consoleErrorSpy.mockRestore();
  });
});