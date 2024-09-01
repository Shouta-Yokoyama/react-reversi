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
const styled_components_1 = __importDefault(require("styled-components"));
const BoardContext_1 = require("../contexts/BoardContext");
const StyledSquare = styled_components_1.default.button `
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
const StyledCircleBlack = styled_components_1.default.p `
  width: 80px;
  height: 80px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: -2px;
  border-radius: 50%;
  border: 3px solid #000000;
  background: #000;
`;
const StyledCircleWhite = styled_components_1.default.p `
  width: 80px;
  height: 80px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: -2px;
  border-radius: 50%;
  border: 3px solid #000000;
  background: #fff;
`;
const Square = (props) => {
    const context = (0, react_1.useContext)(BoardContext_1.BoardContext);
    if (!context) {
        throw new Error("BoardContext must be used within a Context.Provider");
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(StyledSquare, { onClick: (event) => context.handleClick(event, props) },
            props.state === 1 && react_1.default.createElement(StyledCircleBlack, null),
            props.state === -1 && react_1.default.createElement(StyledCircleWhite, null))));
};
exports.default = Square;
