import React from "react";

import "./Card.css";

interface Props {
  children: React.ReactNode;
}

const Card: React.FC<Props> = (props) => {
  return <div className="card-container">{props.children}</div>;
};

export default Card;
