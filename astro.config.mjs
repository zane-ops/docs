import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
const defaultDomain = process.env.ZANE_DOMAINS?.split(",")[0] ?? "zaneops.dev";
export default defineConfig({
  site: `https://${defaultDomain}`,

  env: {
    schema: {
      ASSETS_SERVER_DOMAIN: envField.string({
        context: "client",
        access: "public",
        url: true,
        default: "https://assets.zaneops.dev"
      })
    }
  },

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
        "./src/assets/global.css",
        "./src/assets/fonts/font-face.css"
      ],
      social: [
        {
          label: "Github",
          icon: "github",
          href: "https://github.com/zane-ops/zane-ops"
        },
        {
          label: "Discord",
          icon: "discord",
          href: "https://zaneops.dev/discord"
        }
      ],
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
              label: "Troubleshooting",
              slug: "troubleshooting"
            },

            {
              label: "Upgrading ZaneOps",
              slug: "upgrading-zaneops"
            },
            {
              label: "Domain configuration for ZaneOps",
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

    react()
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});
