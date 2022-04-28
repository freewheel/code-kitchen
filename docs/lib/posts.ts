import fsp from "fs/promises";
import remarkGfm from "remark-gfm";

import { serialize } from "next-mdx-remote/serialize";

import path from "path";

import { codeMetaPlugin } from "./rehype-code-meta";

const postsDirectory = path.join(process.cwd(), "posts");

export async function getPostsData() {
  // Get file names under /posts
  const fileNames = await fsp.readdir(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      // Remove ".mdx" from file name to get id
      const id = fileName.replace(/\.mdx$/, "");

      // Combine the data with the id
      return {
        id,
        fileName,
      };
    })
  );
  // Sort posts by date
  return allPostsData;
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.mdx`);
  const source = await fsp.readFile(fullPath, "utf8");

  const mdxSource = await serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [codeMetaPlugin],
    },
  });

  return {
    source: mdxSource,
  };
}
