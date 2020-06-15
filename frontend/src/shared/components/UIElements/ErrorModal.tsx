import React from "react";

import "./ErrorModal.css";

interface Props {
  message: string;
  onClick: () => void;
}

const ErrorModal: React.FC<Props> = (props) => {
  return (
    <div className="error-modal__container">
      {/* <div className="error-modal__wrapper"> */}
      <div className="error-modal__message">{props.message}</div>
      <div onClick={props.onClick} className="error-modal__button">
        CLOSE
      </div>
      {/* </div> */}
    </div>
  );
};

export default ErrorModal;
