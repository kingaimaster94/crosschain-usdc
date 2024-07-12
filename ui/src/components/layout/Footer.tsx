import React from "react";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="p-6 footer bg-neutral text-neutral-content">
      <div className="flex flex-col items-center w-64">
        <Image src="/ic-squid.svg" width={32} height={32} alt="footer" />
        <p className="text-center">
          Send token to any chain, any token without a mess.
        </p>
      </div>
      <div>
        <span className="footer-title">Services</span>
        <a className="link link-hover">Satellite</a>
        <a className="link link-hover">Explorer</a>
      </div>
      <div>
        <span className="footer-title">Company</span>
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
      </div>
    </footer>
  );
};
