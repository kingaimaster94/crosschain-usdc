import React, { FunctionComponent } from "react";

interface SwapContainerProps {}

export const SwapContainer: FunctionComponent<SwapContainerProps> = ({
  children,
}) => {
  return (
    <div className="z-40 flex flex-col p-4 py-6 m-8 shadow-xl card rounded-3xl bg-base-900 bg-gradient-to-b to-[#191E31] from-[#192431] relative max-w-xl mx-auto">
      <div className="z-10 flex flex-col p-4">{children}</div>
    </div>
  );
};
