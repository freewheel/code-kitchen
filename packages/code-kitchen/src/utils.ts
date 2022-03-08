import * as React from "react";
import { extname } from "./path";

export const inferLoader = (filename: string) => {
  const ext = extname(filename);
  // all JS files are treated as TSX
  if (ext === ".js" || ext === ".jsx" || ext === ".ts" || ext === ".tsx") {
    return "tsx";
  }
  if (ext === ".json") {
    return "json";
  }
  if (ext === ".css") {
    return "css";
  }
  throw new Error(`File format not supported for ${filename}`);
};

export const inferLanguage = (filename: string) => {
  const loader = inferLoader(filename);
  if (loader === "tsx") {
    return "typescript";
  }
  return loader;
};

// prefer old unicode hacks for backward compatibility
// https://base64.guru/developers/javascript/examples/unicode-strings
export function utoa(data: string): string {
  return btoa(unescape(encodeURIComponent(data)));
}

export function atou(base64: string): string {
  return decodeURIComponent(escape(atob(base64)));
}

export const genRandomStr = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, 5);

export function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);
  return debouncedValue;
}
