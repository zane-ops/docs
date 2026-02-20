import { TEMPLATE_API_HOST } from "astro:env/client";
import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import * as React from "react";
import { Pagination } from "~/components/templates/pagination";
import type { TemplateDocument, TemplateSearchAPIResponse } from "~/lib/types";
import { cn, durationToMs } from "~/lib/utils";

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

const PER_PAGE = 18;

export function TemplateSearch() {
  const [searchTerm, setSearchTerm] = useQueryState("query");

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  );

  const { data } = useQuery({
    queryKey: ["TEMPLATES", { searchTerm, currentPage }],
    queryFn: async ({ signal }) => {
      const url = new URL("/api/search", TEMPLATE_API_HOST);

      if (searchTerm) {
        url.searchParams.set("q", searchTerm);
      }

      url.searchParams.set("per_page", PER_PAGE.toString());
      url.searchParams.set("page", currentPage.toString());

      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      return response.json() as Promise<TemplateSearchAPIResponse>;
    }
  });

  const hits = data?.hits ?? [];

  let totalPages = 0;

  if (data && data.found > hits.length) {
    totalPages = Math.ceil(data.found / PER_PAGE);
  }

  return (
    <section
      id="header"
      className="py-12 md:pt-24 gap-8 flex flex-col items-center"
    >
      <h1 className="text-center">Deploy your app in one click</h1>

      <div className="flex flex-col w-full gap-2">
        <form className="relative w-full flex">
          <input
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            autoComplete="off"
            className="w-full px-4 py-2 pr-10 rounded-md border border-border bg-bg text-(--sl-color-text) focus:outline-none focus:ring-2 focus:ring-(--sl-color-accent)"
            placeholder="Search templates... (e.g. postgres, redis, n8n)"
            name="query"
            autoFocus
          />
          <SearchIcon className="absolute top-1/2 -translate-y-1/2 right-4 size-4 flex-none text-(--sl-color-text)" />
        </form>
        {data && (
          <small className="text-start w-full">
            Found {data.found} results in {data.search_time_ms}ms
          </small>
        )}
      </div>

      <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none pl-0 ">
        {hits.map(({ document }) => (
          <li key={document.id}>
            <TemplateCard document={document} />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onChangePage={setCurrentPage}
        />
      )}
    </section>
  );
}

function TemplateCard({ document: doc }: { document: TemplateDocument }) {
  const logoUrl = new URL(doc.logoUrl, TEMPLATE_API_HOST);
  return (
    <div
      className={cn(
        "h-full relative border flex flex-col gap-3 py-4",
        "border-border  bg-(--sl-color-bg-nav) dark:bg-bg hover:dark:bg-(--sl-color-grey-6)",
        "hover:border-(--sl-color-white) transition-colors focus-within:dark:bg-(--sl-color-grey-6) focus-within:border-(--sl-color-white)",
        "hover:bg-(--sl-color-gray-6)",
        "rounded-lg shadow-sm"
      )}
    >
      <div className="flex flex-col items-start gap-6">
        <div className="flex justify-between gap-2 items-center w-full pr-4">
          <div className="flex items-center gap-2  border-gray-400/30  w-full px-4">
            <img
              src={logoUrl.toString()}
              alt={doc.name}
              className="size-8 object-contain flex-none rounded-sm"
            />
            <a
              href={`./templates/${doc.id}`}
              className="font-semibold truncate after:inset-0 after:absolute no-underline text-(--sl-color-white)"
            >
              {doc.name}
            </a>
          </div>

          <ArrowRightIcon className="size-5 flex-none" />
        </div>

        <div className="px-4">
          <p className="text-base line-clamp-3">{doc.description}</p>
        </div>
      </div>
    </div>
  );
}
