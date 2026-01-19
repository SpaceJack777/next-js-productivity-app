import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
    optimizePackageImports: [
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/extension-task-list",
      "@tiptap/extension-task-item",
      "@tiptap/extension-code-block-lowlight",
      "lowlight",
      "lucide-react",
      "highlight.js",
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
