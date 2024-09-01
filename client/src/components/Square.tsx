import React, { useContext } from "react";
import styled from "styled-components";
import { BoardContext } from "../contexts/BoardContext";
import { SquareProps } from "../types";

const StyledSquare = styled.button`
  width: 12%;
  font-size: 25px;
  aspect-ratio: 1;
  justify-items: center;
  align-content: center;
  background-color: green;
  color: #000;
  border: 1px solid #000000;
  float: left;
`;

//二つ用意していて美しくない
const StyledCircleBlack = styled.p`
  width: 80px;
  height: 80px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: -2px;
  border-radius: 50%;
  border: 3px solid #000000;
  background: #000;
`;

const StyledCircleWhite = styled.p`
  width: 80px;
  height: 80px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: -2px;
  border-radius: 50%;
  border: 3px solid #000000;
  background: #fff;
`;

const Square: React.FC<SquareProps> = (props) => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("BoardContext must be used within a Context.Provider");
  }

  return (
    <>
      <StyledSquare onClick={(event) => context.handleClick(event, props )}>
        {props.state === 1 && <StyledCircleBlack />}
        {props.state === -1 && <StyledCircleWhite />}
      </StyledSquare>
    </>
  );
};
export default Square;
