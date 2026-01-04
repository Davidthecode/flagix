import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
};

const withMDX = createMDX({
  mdxOptions: {
    rehypeCodeOptions: {
      langs: ["ts", "tsx", "js", "jsx", "json", "bash", "sh", "shell"],
    },
  },
});

export default withMDX(config);
