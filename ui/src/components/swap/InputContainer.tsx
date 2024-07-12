import { ComponentStyle } from "types/component";
import React from "react";

export const InputContainer: React.FC<ComponentStyle> = ({
  children,
  className,
}) => {
  return (
    <div
      className="bg-[#181A25] p-4 rounded-xl"
      style={{
        boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
    >
      {children}
    </div>
  );
};
