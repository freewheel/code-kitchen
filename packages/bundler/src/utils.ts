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
