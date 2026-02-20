import { TEMPLATE_API_HOST } from "astro:env/client";
import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ChevronRightIcon, SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import * as React from "react";
import type { TemplateDocument, TemplateSearchAPIResponse } from "~/lib/types";
import { durationToMs } from "~/lib/utils";

export default function TemplateSearchPage() {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            placeholderData: keepPreviousData,
            gcTime: durationToMs(3, "days"),
            retry(failureCount, error) {
              // error responses are valid responses that react router can handle, so we don't want to retry them
              return !(error instanceof Response) && failureCount < 3;
            }
          }
        }
      })
  );

  return (
    <NuqsAdapter fullPageNavigationOnShallowFalseUpdates>
      <QueryClientProvider client={queryClient}>
        <TemplateSearch />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </NuqsAdapter>
  );
}

export function TemplateSearch() {
  const [searchTerm, setSearchTerm] = useQueryState("query");

  const { data } = useQuery({
    queryKey: ["TEMPLATES", searchTerm],
    queryFn: async ({ signal }) => {
      const url = new URL("/api/search", TEMPLATE_API_HOST);
      if (searchTerm) url.searchParams.set("q", searchTerm);
      url.searchParams.set("per_page", "18");
      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json() as Promise<TemplateSearchAPIResponse>;
    }
  });

  const hits = data?.hits ?? [];

  return (
    <section
      id="header"
      className="py-12 md:pt-24 gap-8 flex flex-col items-center"
    >
      <h1 className="text-center">Deploy your app in one click</h1>

      <div className="relative w-full flex">
        <input
          value={searchTerm || ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="w-full px-4 py-2 pr-10 rounded-md border border-border bg-bg text-(--sl-color-text) focus:outline-none focus:ring-2 focus:ring-(--sl-color-accent)"
          placeholder="Search templates... (e.g. postgres, redis, n8n)"
          name="template"
        />
        <SearchIcon className="absolute top-1/2 -translate-y-1/2 right-4 size-4 flex-none text-(--sl-color-text)" />
      </div>

      <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none pl-0 ">
        {hits.map(({ document }) => (
          <li key={document.id}>
            <TemplateCard document={document} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function TemplateCard({ document: doc }: { document: TemplateDocument }) {
  const logoUrl = new URL(doc.logoUrl, TEMPLATE_API_HOST);
  return (
    <div className="h-full relative border flex flex-col gap-3 border-border py-4 bg-(--sl-color-bg-nav) dark:bg-bg hover:border-(--sl-color-accent) transition-colors">
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2 border-b border-gray-400/30  w-full pb-4 px-4">
          <img
            src={logoUrl.toString()}
            alt={doc.name}
            className="size-8 object-contain flex-none rounded-sm"
          />
          <a
            href={`./templates/${doc.id}`}
            className="font-semibold truncate after:inset-0 after:absolute no-underline hover:text-(--sl-color-accent) text-(--sl-color-white)"
          >
            {doc.name}
          </a>
        </div>

        <div className="px-4">
          <p className="text-base line-clamp-3">{doc.description}</p>
        </div>
      </div>

      <ul className="px-4 flex items-center gap-2 list-none flex-wrap p-0 w-full justify-start ">
        {doc.tags.map((tag) => (
          <li
            key={tag}
            className="bg-(--sl-color-black) text-(--sl-color-white) rounded-full px-2 text-sm py-0.5"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="flex flex-col justify-end grow">
        <div className=" justify-end border-gray-400/30 px-4  flex items-center gap-3">
          <span>Deploy</span>
          <ChevronRightIcon className="size-4 flex-none" />
        </div>
      </div>
    </div>
  );
}
