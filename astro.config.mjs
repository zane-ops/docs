// @ts-check
import node from "@astrojs/node";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
const defaultDomain = process.env.ZANE_DOMAINS?.split(",")[0] || "zaneops.dev";
const scheme = process.env.NODE_ENV === "production" ? "https" : "http";
export default defineConfig({
  site: `${scheme}://${defaultDomain}`,
  output: "static",
  adapter: node({
    mode: "standalone"
  }),
  prefetch: true,
  env: {
    schema: {
      PRIVATE_TEMPLATE_API_HOST: envField.string({
        context: "server",
        access: "secret",
        url: true,
        default: "https://templates.zaneops.dev"
      }),
      TEMPLATE_API_HOST: envField.string({
        context: "client",
        access: "public",
        url: true,
        default: "https://templates.zaneops.dev"
      }),
      ASSETS_SERVER_DOMAIN: envField.string({
        context: "client",
        access: "public",
        url: true,
        default: "https://assets.zaneops.dev"
      }),
      DATABASE_URL: envField.string({
        context: "server",
        access: "secret"
      }),
      SMTP_HOST: envField.string({
        context: "server",
        access: "secret",
        optional: true,
        default: "localhost"
      }),
      SMTP_PORT: envField.string({
        context: "server",
        access: "secret",
        optional: true,
        default: "1025"
      }),
      SMTP_SECURE: envField.string({
        context: "server",
        access: "secret",
        optional: true,
        default: "false"
      }),
      SMTP_USER: envField.string({
        context: "server",
        access: "secret",
        optional: true,
        default: ""
      }),
      SMTP_PASSWORD: envField.string({
        context: "server",
        access: "secret",
        optional: true,
        default: ""
      }),
      VERIFICATION_EMAIL_FROM: envField.string({
        context: "server",
        access: "secret"
      }),
      ANTHROPIC_API_KEY: envField.string({
        context: "server",
        access: "secret"
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
        Head: "./src/components/Head.astro",
        PageFrame: "./src/components/PageFrame.astro"
      },
      sidebar: [
        {
          label: "Start here",
          items: [
            {
              label: "What is ZaneOps ?",
              slug: "introduction"
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
              label: "Architecture",
              slug: "architecture"
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
          autogenerate: { directory: "knowledge-base", collapsed: true }
        },
        {
          label: "Changelog",
          autogenerate: { directory: "changelog" },
          collapsed: true
        },
        {
          label: "Tutorials",
          autogenerate: { directory: "tutorials" }
        },
        {
          label: "API Reference",
          collapsed: true,
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
    // @ts-ignore
    plugins: [tailwindcss()]
  }
});
