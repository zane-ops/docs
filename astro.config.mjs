import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PROD
    ? "https://zaneops.dev"
    : "https://local.zaneops.dev",
  devToolbar: {
    enabled: false
  },
  integrations: [
    starlight({
      title: "ZaneOps documentation",
      logo: {
        light: "./src/assets/ZaneOps-SYMBOL-BLACK.svg",
        dark: "./src/assets/ZaneOps-SYMBOL-WHITE.svg",
        replacesTitle: true
      },
      editLink: {
        baseUrl: "https://github.com/zane-ops/docs/edit/main/"
      },
      customCss: [
        "./src/tailwind.css",
        "./src/assets/theme.css",
        "./src/assets/fonts/font-face.css"
      ],
      social: {
        github: "https://github.com/zane-ops/zane-ops",
        twitter: "https://twitter.com/zaneopsdev"
      },
      components: {
        Footer: "./src/components/Footer.astro",
        Head: "./src/components/Head.astro"
      },
      sidebar: [
        {
          label: "Start here",
          items: [
            {
              label: "Installation and Setup",
              slug: "get-started"
            },
            {
              label: "Screenshots",
              slug: "screenshots"
            }
          ]
        },
        {
          label: "Development",
          items: [
            {
              label: "Development",
              slug: "development/development"
            }
          ]
        },
        {
          label: "Changelog",
          items: [
            {
              label: "ZaneOps v1.0",
              slug: "changelog/announcing-v1"
            }
          ]
        },
        {
          label: "API Reference",
          items: [
            {
              label: "Introduction",
              slug: "api-reference/introduction"
            },
            {
              label: "Authentication",
              slug: "api-reference/authentication"
            },
            {
              label: "OpenAPI reference ↗",
              link: "/api-reference/openapi"
            }
          ]
        }
      ]
    }),
    tailwind({
      applyBaseStyles: false
    }),
    react()
  ]
});
