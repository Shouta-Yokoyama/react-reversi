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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const BoardContext_1 = require("../contexts/BoardContext");
const Square = (props) => {
    const context = (0, react_1.useContext)(BoardContext_1.BoardContext);
    if (!context) {
        throw new Error("BoardContext must be used within a Context.Provider");
    }
    return (react_1.default.createElement("button", { className: "w-[12%] text-2xl aspect-square bg-green-600 text-black border border-black float-left", onClick: (event) => context.handleClick(event, props), "data-testid": "square-button" },
        props.state === 1 && (react_1.default.createElement("div", { className: "w-20 h-20 m-auto rounded-full border-3 border-black bg-black", "data-testid": "circle-black" })),
        props.state === -1 && (react_1.default.createElement("div", { className: "w-20 h-20 m-auto rounded-full border-3 border-black bg-white", "data-testid": "circle-white" }))));
};
exports.default = Square;
