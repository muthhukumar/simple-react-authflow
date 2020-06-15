import React from "react";

const Layout: React.FC = (props) => {
  return (
    <React.Fragment>
      <div className="background-image"></div>
      {props.children}
    </React.Fragment>
  );
};

export default Layout;
