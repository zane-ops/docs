import { defineLiveCollection } from "astro:content";
import { PRIVATE_TEMPLATE_API_HOST } from "astro:env/server";
import { z } from "astro/zod";
import { templatesLoader } from "~/loaders/templates-loader";

export const collections = {
  templates: defineLiveCollection({
    loader: templatesLoader({
      apiHost: PRIVATE_TEMPLATE_API_HOST
    }),
    schema: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      logoUrl: z.string(),
      compose: z.string(),
      tags: z.array(z.string()),
      githubUrl: z.string().optional(),
      docsUrl: z.string().optional(),
      websiteUrl: z.string().optional(),
      related: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          logoUrl: z.string()
        })
      )
    })
  })
};
