import type { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import { getAllPosts, PostMeta } from "@/src/api";
import Articles from "@/src/components/articles";

export default function TagsPage({
  slug,
  posts,
}: {
  slug: string;
  posts: PostMeta[];
}) {
  const title = `Tag: ${slug}`;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>Tag: {slug}</h1>
      <Articles posts={posts} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  const tags = new Set(posts.map((post) => post.meta.tags).flat());
  const paths = Array.from(tags).map((tag) => ({ params: { slug: tag } }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };

  // find all post that have this tag
  const posts = getAllPosts().filter((post) => post.meta.tags.includes(slug));
  return {
    props: {
      slug,
      posts: posts.map((post) => post.meta),
    },
  };
};
