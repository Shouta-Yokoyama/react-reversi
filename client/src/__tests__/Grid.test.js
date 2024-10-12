"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const react_2 = __importDefault(require("react"));
const Grid_1 = __importDefault(require("../components/Grid"));
const Square_1 = __importDefault(require("../components/Square"));
const BoardContext_1 = require("../contexts/BoardContext");
jest.mock("../components/Square");
const mockContext = {
    boardState: Array(8).fill(Array(8).fill(0)),
    handleClick: jest.fn(),
};
const renderGrid = () => {
    return (0, react_1.render)(react_2.default.createElement(BoardContext_1.BoardContext.Provider, { value: mockContext },
        react_2.default.createElement(Grid_1.default, null)));
};
describe("Grid component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("renders a grid", () => {
        renderGrid();
        expect(react_1.screen.getByRole("table")).toBeInTheDocument();
    });
    it("grid has a 8 rows", () => {
        renderGrid();
        const rows = react_1.screen.getAllByRole("row");
        expect(rows).toHaveLength(8);
    });
    it("grid has a 64 squares", () => {
        renderGrid();
        const square = Square_1.default;
        expect(square.mock.calls).toHaveLength(64);
    });
});
