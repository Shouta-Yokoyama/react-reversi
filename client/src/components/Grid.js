"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const BoardContext_1 = require("../contexts/BoardContext");
const Square_1 = __importDefault(require("./Square"));
const Grid = () => {
    const boardInitData = [];
    const context = (0, react_1.useContext)(BoardContext_1.BoardContext);
    if (!context) {
        throw new Error("BoardContext must be used within a Context.Provider");
    }
    let tmp = 0;
    for (let i = 0; i < 8; i++) {
        const dataList = [];
        for (let j = 0; j < 8; j++) {
            const data = {
                posX: i,
                posY: j,
                state: context.boardState[i][j],
                key: tmp++,
            };
            dataList.push(data);
        }
        boardInitData.push(dataList);
    }
    const generateGridRow = (x, index) => (react_1.default.createElement("div", { role: "row", key: index, className: "max-w-[800px] max-h-[800px] flex" },
        react_1.default.createElement(Square_1.default, Object.assign({}, x[0])),
        react_1.default.createElement(Square_1.default, Object.assign({}, x[1])),
        react_1.default.createElement(Square_1.default, Object.assign({}, x[2])),
        react_1.default.createElement(Square_1.default, Object.assign({}, x[3])),
        react_1.default.createElement(Square_1.default, Object.assign({}, x[4])),
        react_1.default.createElement(Square_1.default, Object.assign({}, x[5])),
        react_1.default.createElement(Square_1.default, Object.assign({}, x[6])),
        react_1.default.createElement(Square_1.default, Object.assign({}, x[7]))));
    return react_1.default.createElement("div", { role: "table" }, boardInitData.map((x, i) => generateGridRow(x, i)));
};
exports.default = Grid;
