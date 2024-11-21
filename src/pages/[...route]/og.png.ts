import { getCollection } from "astro:content";
import { Resvg } from "@resvg/resvg-js";
import type { APIRoute } from "astro";
import satori from "satori";
import { OpenGraph, type OpenGraphProps } from "../../components/opengraph";

async function SVG(props: OpenGraphProps) {
  const fontWeights = [400, 500, 600] as const;
  const fontFiles = await Promise.all(
    fontWeights.map((wght) =>
      fetch(
        `https://cdn.jsdelivr.net/fontsource/fonts/geist-mono@latest/latin-${wght}-normal.woff`
      ).then((res) => res.arrayBuffer())
    )
  );

  const fontData = fontWeights.map((wght, index) => ({
    name: "Geist",
    data: fontFiles[index],
    weight: wght,
    style: "normal" as const
  }));

  return await satori(OpenGraph(props), {
    width: 1200,
    height: 630,
    fonts: fontData
  });
}

export const GET: APIRoute = async function get({ props }) {
  const resvg = new Resvg(
    await SVG({
      title: props.title ?? "Zaneops documentation",
      description: props.description ?? "zaneops.dev"
    }),
    {
      background: "rgba(255, 255, 255, 1)",
      fitTo: {
        mode: "width",
        value: 1200
      }
    }
  );

  return new Response(resvg.render().asPng(), {
    status: 200,
    headers: {
      "Content-Type": "image/png"
    }
  });
};

export async function getStaticPaths() {
  const docs = await getCollection("docs");

  return [
    ...docs,
    {
      slug: "api-reference/openapi",
      data: {
        title: "API Reference",
        description: "full open api reference for zaneops."
      }
    }
  ].map((doc) => {
    if (doc.slug === "index") {
      return {
        params: { route: undefined },
        props: {
          title: "Zaneops",
          description:
            "A self-hosted platform for deploying web apps, databases, CRONS, and more..."
        }
      };
    }
    return {
      params: { route: doc.slug },
      props: { title: doc.data.title, description: doc.data.description }
    };
  });
}
