"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const InputBox = (props) => (react_1.default.createElement("input", { className: "text-black", type: "text", value: props.state, onChange: (e) => props.setFn(e.target.value), placeholder: props.placeholder }));
exports.default = InputBox;
