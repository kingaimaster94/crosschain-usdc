import React, { FunctionComponent } from "react";
import { SpinnerDotted } from "spinners-react";
import { ComponentStyle } from "../../types/component";

interface LoadingIndicatorProps extends ComponentStyle {
  width?: number;
  height?: number;
  baseColor?: string;
  highlightColor?: string;
}

export const LoadingIndicator: FunctionComponent<LoadingIndicatorProps> = ({
  width,
  height,
  baseColor = "#444",
  highlightColor = "#666",
}) => {
  return (
    <SpinnerDotted
      className="block"
      size={30}
      thickness={150}
      speed={100}
      color="rgba(118, 15, 200, 1)"
    />
  );
};
