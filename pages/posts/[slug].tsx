import type { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import Head from "next/head";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import { getPostFromSlug, getSlugs, PostMeta } from "@/src/api";
import YouTube from "@/src/components/youTube";
import "highlight.js/styles/github-dark.css";

interface MDXPost {
  source: MDXRemoteSerializeResult;
  meta: PostMeta;
}

export default function PostPage({ post }: { post: MDXPost }) {
  return (
    <>
      <Head>
        <title>{post.meta.title}</title>
      </Head>
      <h1>{post.meta.title}</h1>
      <MDXRemote {...post.source} components={{ YouTube, Image }} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // params is `my-slug` in http://mysite/my-slug

  const { slug } = params as { slug: string };
  const { content, meta } = getPostFromSlug(slug);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }], // add links to each section headings
        rehypeHighlight,
      ],
    },
  });

  return {
    props: { post: { source: mdxSource, meta } },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  /* we need to return something like this:
                                           [{ params: { slug: "swr" } }, { params: { slug: "reduce" } }];
                                      */

  const paths = getSlugs().map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false, // don't do this dynamically
  };
};
