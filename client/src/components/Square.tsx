import React, { useContext } from "react";
import { BoardContext } from "../contexts/BoardContext";
import { SquareProps } from "../types";

const Square: React.FC<SquareProps> = (props) => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("BoardContext must be used within a Context.Provider");
  }

  return (
    <button
      className="w-[12%] text-2xl aspect-square bg-green-500 text-black border border-black float-left"
      onClick={(event) => context.handleClick(event, props)}
      data-testid="square-button"
    >
      {props.state === 1 && (
        <div
          className="w-20 h-20 m-auto rounded-full border-3 border-black bg-black"
          data-testid="circle-black"
        />
      )}
      {props.state === -1 && (
        <div
          className="w-20 h-20 m-auto rounded-full border-3 border-black bg-white"
          data-testid="circle-white"
        />
      )}
    </button>
  );
};

export default Square;
