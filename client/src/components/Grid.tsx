import React, { useContext } from "react";
import styled from "styled-components";
import { BoardContext } from "../contexts/BoardContext";
import { SquareProps } from "../types";
import Square from "./Square";
const StyledGridRow = styled.div`
  max-width: 800px;
  max-height: 800px;
`;

const Grid: React.FC = () => {
    const boardInitData: SquareProps[][] = [];
    const context = useContext(BoardContext);

    if(!context){
        throw new Error("BoardContext must be used within a Context.Provider");
    }

    let tmp: number = 0;
    for (let i = 0; i < 8; i++) {
        
        const dataList :SquareProps[] = [];
        for (let j = 0; j < 8; j++) {    
            const data: SquareProps = {
                posX: i,
                posY: j,
                state: context.boardState[i][j],
                key: tmp++,
            };
            dataList.push(data);
        }
        boardInitData.push(dataList);
    }

    const generateGridRow = (x: SquareProps[],index:number) => (
        <StyledGridRow key={index}>
            <Square {...x[0]} />
            <Square {...x[1]} />
            <Square {...x[2]} />
            <Square {...x[3]} />
            <Square {...x[4]} />
            <Square {...x[5]} />
            <Square {...x[6]} />
            <Square {...x[7]} />
        </StyledGridRow>
    );

    return <div>{boardInitData.map((x,i) => generateGridRow(x,i))}</div>;
};

export default Grid;
