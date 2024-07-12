import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Error = () => {
  const { query } = useRouter();
  return (
    <div className="shadow-xl mx-auto card w-96 bg-base-100">
      <div className="card-body">
        <h1 className="card-title">{query.title}</h1>
        <div>{query.msg}</div>
        <Link href={"/"} passHref={true}>
          <button className="mt-4 btn btn-primary">Go to swap</button>
        </Link>
      </div>
    </div>
  );
};

export default Error;
