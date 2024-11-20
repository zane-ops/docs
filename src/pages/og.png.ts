import { Resvg } from "@resvg/resvg-js";
import type { APIRoute } from "astro";
import satori from "satori";
import { OpenGraph, type OpenGraphProps } from "../components/opengraph";

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

export const GET: APIRoute = async function get() {
  const resvg = new Resvg(
    await SVG({
      title: "Zaneops documentation",
      description: "zaneops.dev"
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
