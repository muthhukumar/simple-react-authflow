import React from "react";
import ReactDOM from "react-dom";

import "./BackDrop.css";

interface Props {
  onClick: () => void;
}

const BackDrop: React.FC<Props> = (props) => {
  return ReactDOM.createPortal(
    <div className="backdrop-modal" onClick={props.onClick}></div>,
    document.getElementById("backdrop-modal")!
  );
};

export default BackDrop;
