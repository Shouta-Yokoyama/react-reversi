import React from "react";
import { InputBoxProps } from "../types";

const InputBox: React.FC<InputBoxProps> = (props) => (
  <input
    className="text-black"
    type="text"
    value={props.state}
    onChange={(e) => props.setFn(e.target.value)}
    placeholder={props.placeholder}
  />
);

export default InputBox;
