"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const InputBox = (props) => (react_1.default.createElement("input", { className: "bg-gray-800 text-white border border-gray-600 rounded-lg px-5 py-3 w-full focus:ring-2 focus:ring-indigo-500 transition-all", type: "text", value: props.state, onChange: (e) => props.setFn(e.target.value), placeholder: props.placeholder }));
exports.default = InputBox;
