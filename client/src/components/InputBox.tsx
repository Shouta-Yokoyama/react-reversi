import React from "react";
import { InputBoxProps } from "../types";

const InputBox: React.FC<InputBoxProps> = (props) => (
  <input
    className="bg-gray-700 text-white border border-gray-600 rounded px-4 py-2 dark:bg-gray-800 dark:text-gray-200"
    type="text"
    value={props.state}
    onChange={(e) => props.setFn(e.target.value)}
    placeholder={props.placeholder}
  />
);

export default InputBox;
