import type { LiveLoader } from "astro/loaders";
import type { TemplateSearchAPIResponse } from "~/lib/types";

export type Template = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  logoUrl: string;
  githubUrl: string;
  docsUrl: string;
  websiteUrl: string;
  url: string;
  compose: string;
};

interface EntryFilter {
  id: string;
}

export function templatesLoader(config: {
  apiHost: string;
}): LiveLoader<Template, EntryFilter> {
  return {
    name: "templates-loader",
    loadCollection: async () => {
      return { entries: [] };
    },
    loadEntry: async ({ filter }) => {
      let t0 = performance.now();

      const url = new URL(`/api/templates/${filter.id}.json`, config.apiHost);

      const response = await fetch(url);

      console.log(
        `[${filter.id}] fetch template: ${(performance.now() - t0).toFixed(2)}ms`
      );

      if (!response.ok) {
        return {
          error: new Error("Template not found")
        };
      }

      const template: Template = await response.json();

      t0 = performance.now();
      const templateSearchUrl = new URL("/api/search", config.apiHost);
      templateSearchUrl.searchParams.set("per_page", "4");
      templateSearchUrl.searchParams.set("pick_random", "true");
      templateSearchUrl.searchParams.set("exclude_ids", template.id);

      for (const tag of template.tags) {
        templateSearchUrl.searchParams.append("tags", tag);
      }

      const { hits: templateList } = await fetch(templateSearchUrl).then(
        (r) => r.json() as Promise<TemplateSearchAPIResponse>
      );

      console.log(
        `[${filter.id}] fetch related templates: ${(performance.now() - t0).toFixed(2)}ms`
      );

      return {
        id: template.id,
        data: {
          ...template,
          related: templateList.map(({ document }) => document)
        }
      };
    }
  };
}
