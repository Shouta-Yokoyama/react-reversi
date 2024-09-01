import { createContext } from "react";
import { SquareProps } from "../types";

type BoardContextType = {
  handleClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    buttonProps: SquareProps
  ) => void;
  boardState: number[][];
};

export const BoardContext = createContext<BoardContextType | undefined>(
  undefined
);
