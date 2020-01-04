import React, { FunctionComponent, CSSProperties } from "react";

const DefaultNotFound: FunctionComponent = () => {
  const DefaultnotfoundStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "22px",
  };
  return <div style={DefaultnotfoundStyle}>The page you visited is not found!</div>;
};

export { DefaultNotFound };
