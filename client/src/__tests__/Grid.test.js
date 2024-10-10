"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const react_2 = __importDefault(require("react"));
const Grid_1 = __importDefault(require("../components/Grid"));
const BoardContext_1 = require("../contexts/BoardContext");
const mockContext = {
    boardState: Array(8).fill(Array(8).fill(0)),
    handleClick: jest.fn(),
};
const renderGrid = () => {
    return (0, react_1.render)(react_2.default.createElement(BoardContext_1.BoardContext.Provider, { value: mockContext },
        react_2.default.createElement(Grid_1.default, null)));
};
