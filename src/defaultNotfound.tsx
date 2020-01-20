import React, { FunctionComponent, CSSProperties } from "react";
import { RouteComponentProps } from "react-router-dom";

const DefaultNotFound: FunctionComponent<RouteComponentProps> = () => {
  const DefaultNotfoundStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.4rem",
    color: "#ccc",
  };

  return <div style={DefaultNotfoundStyle}>The page you visited is not found!</div>;
};

export { DefaultNotFound };
