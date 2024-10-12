"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const react_2 = __importDefault(require("react"));
const Square_1 = __importDefault(require("../components/Square"));
const BoardContext_1 = require("../contexts/BoardContext");
const mockContext = {
    boardState: Array(8).fill(Array(8).fill(0)),
    handleClick: jest.fn(),
};
const renderSquare = (props) => {
    return (0, react_1.render)(react_2.default.createElement(BoardContext_1.BoardContext.Provider, { value: mockContext },
        react_2.default.createElement(Square_1.default, { posX: props.posX, posY: props.posY, state: props.state, key: props.key })));
};
describe("Square Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("renders a black circle when state is 1", () => {
        renderSquare({ posX: 1, posY: 1, state: 1, key: 0 });
        const blackCircle = react_1.screen.getByTestId("circle-black");
        expect(blackCircle).toBeInTheDocument();
        expect(blackCircle).toHaveClass("bg-black");
    });
    it("renders a white circle when state is -1", () => {
        renderSquare({ posX: 1, posY: 1, state: -1, key: 0 });
        const whiteCircle = react_1.screen.getByTestId("circle-white");
        expect(whiteCircle).toBeInTheDocument();
        expect(whiteCircle).toHaveClass("bg-white");
    });
    it("does not render any circle when state is 0", () => {
        renderSquare({ posX: 1, posY: 1, state: 0, key: 0 });
        expect(react_1.screen.queryByTestId("circle-black")).not.toBeInTheDocument();
        expect(react_1.screen.queryByTestId("circle-white")).not.toBeInTheDocument();
    });
    it("calls context handleClick on button click", () => {
        renderSquare({ posX: 1, posY: 1, state: 0, key: 0 });
        const button = react_1.screen.getByTestId("square-button");
        react_1.fireEvent.click(button);
        expect(mockContext.handleClick).toHaveBeenCalled();
    });
    it("throws an error if used outside of BoardContext", () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
        expect(() => (0, react_1.render)(react_2.default.createElement(Square_1.default, { state: 0, posX: 0, posY: 0, key: 0 }))).toThrow("BoardContext must be used within a Context.Provider");
        consoleErrorSpy.mockRestore();
    });
});
