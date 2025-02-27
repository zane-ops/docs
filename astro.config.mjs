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
              label: "Welcome to zaneops",
              slug: "welcome"
            },
            {
              label: "Installation and Setup",
              slug: "installation"
            },
            {
              label: "DNS configuration",
              slug: "configuring-zaneops"
            },
            {
              label: "Reset user password",
              slug: "reset-password"
            },
            {
              label: "Uninstalling ZaneOps",
              slug: "uninstall"
            },
            {
              label: "Stopping ZaneOps",
              slug: "stopping-zaneops"
            },
            {
              label: "Screenshots",
              slug: "screenshots"
            }
          ]
        },
        {
          label: "Knowledge base",
          autogenerate: { directory: "knowledge-base" }
        },
        {
          label: "Changelog",
          autogenerate: { directory: "changelog" }
        },
        {
          label: "Tutorials",
          autogenerate: { directory: "tutorials" }
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
