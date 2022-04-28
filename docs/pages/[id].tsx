/* eslint-disable react/prop-types */
import React from "react";
import { MDXRemote } from "next-mdx-remote";
import { getPostData, getPostsData } from "../lib/posts";

import * as mdxComponents from "../components/mdx";
import { Playground } from "../components/MDXPlayground";

const components = { Playground, ...mdxComponents };

export default function Post({ source }) {
  return (
    <div className="wrapper">
      <MDXRemote {...source} components={components} />
    </div>
  );
}

export async function getStaticPaths() {
  const items = await getPostsData();
  return {
    paths: items.map((item) => ({
      params: { id: item.id, original: item.fileName },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = await getPostData(params.id);
  return {
    props: data,
  };
}
