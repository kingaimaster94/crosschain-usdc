import Link from "next/link";
import React from "react";

const Custom404 = () => {
  return (
    <div className="card flex flex-col w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title">Page doesn't exist</h1>
        <Link href={"/"} passHref={true}>
          <button className="btn btn-primary mt-4">Go to swap</button>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
