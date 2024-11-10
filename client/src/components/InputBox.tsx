import React from "react";
import { InputBoxProps } from "../types";

const InputBox: React.FC<InputBoxProps> = (props) => (
  <input
    className="bg-gray-800 text-white border border-gray-600 rounded-lg px-5 py-3 w-full focus:ring-2 focus:ring-indigo-500 transition-all"
    type="text"
    value={props.state}
    onChange={(e) => props.setFn(e.target.value)}
    placeholder={props.placeholder}
  />
);

export default InputBox;
