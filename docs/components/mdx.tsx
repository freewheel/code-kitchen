/* eslint-disable react/prop-types */
import * as React from "react";

export const h1 = ({ children }) => {
  return (
    <h1 className="font-title text-purple-800 text-[24px] font-extrabold my-4">
      {children}
    </h1>
  );
};

export const h2 = ({ children }) => {
  return (
    <h1 className="font-title text-purple-900 text-[20px] font-bold my-4">
      {children}
    </h1>
  );
};

export const h3 = ({ children }) => {
  return (
    <h1 className="font-title text-purple-900 text-[16px] font-bold my-4">
      {children}
    </h1>
  );
};

export const h4 = ({ children }) => {
  return (
    <h1 className="font-title text-gray-800 text-[16px] font-semibold my-4">
      {children}
    </h1>
  );
};

export const hr = ({ children }) => {
  return <hr className="my-8">{children}</hr>;
};

export const p = ({ children }) => {
  return <h1 className="font-sans my-2.5">{children}</h1>;
};

export const ul = ({ children }) => {
  return (
    <ul className={"font-sans leading-relaxed list-disc pl-10 my-2"}>
      {children}
    </ul>
  );
};

export const ol = ({ children }) => {
  return <ol className="font-sans leading-relaxed list-decimal">{children}</ol>;
};

export const code = (props) => {
  return (
    <code className="text-sm font-mono px-0.5">{props.children?.trim()}</code>
  );
};

export const pre = (props) => {
  return (
    <pre
      className={`text-[13px] p-2 bg-gray-200 font-mono leading-snug max-w-full`}
    >
      {props.children}
    </pre>
  );
};
