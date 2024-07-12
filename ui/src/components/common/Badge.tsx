import { ComponentStyle } from "types/component";
import React, { FunctionComponent } from "react";

interface MaxButtonProps extends ComponentStyle {
  onclick?: () => void;
  text: string;
}

export const Badge: FunctionComponent<MaxButtonProps> = ({ onclick, text }) => (
  <span className="gap-2 m-1 badge badge-success">
    <svg
      onClick={onclick}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="inline-block w-4 h-4 cursor-pointer stroke-current"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
    {text}
  </span>
);
