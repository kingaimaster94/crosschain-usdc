import React from "react";
import Image from "next/image";

export const Waves = () => {
  return (
    <div className="fixed left-0 w-full h-[300px] bottom-[-100px] lg:h-[500px] lg:bottom-[-300px]">
      <div className="relative w-full h-full">
        <Image
          style={{ animationDelay: "5s" }}
          className="wave"
          src="/assets/svg/wave5.svg"
          layout="fill"
          alt="wave"
          objectFit="cover"
        />
        <Image
          style={{ animationDelay: "4s" }}
          className="wave"
          src="/assets/svg/wave4.svg"
          layout="fill"
          alt="wave"
          objectFit="cover"
        />
        <Image
          style={{ animationDelay: "3s" }}
          className="wave"
          src="/assets/svg/wave3.svg"
          layout="fill"
          alt="wave"
          objectFit="cover"
        />
        <Image
          style={{ animationDelay: "2s" }}
          className="wave"
          src="/assets/svg/wave2.svg"
          layout="fill"
          alt="wave"
          objectFit="cover"
        />
        <Image
          style={{ animationDelay: "1s" }}
          className="wave"
          src="/assets/svg/wave1.svg"
          layout="fill"
          alt="wave"
          objectFit="cover"
        />
      </div>
    </div>
  );
};
