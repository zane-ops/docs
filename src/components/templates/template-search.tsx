import { TEMPLATE_API_HOST } from "astro:env/client";
import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  SearchIcon
} from "lucide-react";
import {
  parseAsInteger,
  parseAsNativeArrayOf,
  parseAsString,
  useQueryState
} from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import * as React from "react";
import { Button, buttonClassNames } from "~/components/templates/button";
import { Input } from "~/components/templates/input";
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
  const [tags, setTags] = useQueryState(
    "tags",
    parseAsNativeArrayOf(parseAsString)
  );

  const templatesQuery = useQuery({
    queryKey: ["TEMPLATES", { searchTerm, currentPage, tags }],
    queryFn: async ({ signal }) => {
      const url = new URL("/api/search", TEMPLATE_API_HOST);

      if (searchTerm) {
        url.searchParams.set("q", searchTerm);
      }

      url.searchParams.set("per_page", PER_PAGE.toString());
      url.searchParams.set("page", currentPage.toString());
      for (const tag of tags) {
        url.searchParams.append("tags", tag);
      }

      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      return response.json() as Promise<TemplateSearchAPIResponse>;
    }
  });

  const hits = templatesQuery.data?.hits ?? [];

  let totalPages = 0;

  if (templatesQuery.data && templatesQuery.data.found > hits.length) {
    totalPages = Math.ceil(templatesQuery.data.found / PER_PAGE);
  }

  return (
    <section
      id="header"
      className="py-12 md:pt-24 gap-8 flex flex-col items-center"
    >
      <h1 className="text-center">Deploy your app in one click</h1>

      <div className="flex flex-col w-full gap-2">
        <form className="w-full flex items-center gap-4">
          <div className="relative w-full">
            <Input
              value={searchTerm || ""}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
              autoComplete="off"
              placeholder="Search templates... (e.g. postgres, redis, n8n)"
              name="query"
              autoFocus
            />
            <SearchIcon className="absolute top-1/2 -translate-y-1/2 right-4 size-4 flex-none text-(--sl-color-text)" />
          </div>
        </form>
        {templatesQuery.data && (
          <small className="text-start w-full">
            Found {templatesQuery.data.found} results in{" "}
            {templatesQuery.data.search_time_ms}ms
          </small>
        )}
      </div>

      <div className="grid grid-cols-5 gap-4 place-items-start ">
        <TagsListForm selectedTags={tags} onTagSelectChange={setTags} />

        <div className="flex flex-col gap-8 col-span-4 items-center w-full">
          <ul className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 list-none pl-0">
            {hits.map(({ document }) => (
              <li key={document.id} className="w-full">
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
        </div>
      </div>
    </section>
  );
}

type TagsListFormProps = {
  selectedTags: string[];
  onTagSelectChange: (newValues: string[]) => void;
};

function TagsListForm({ selectedTags, onTagSelectChange }: TagsListFormProps) {
  const { data: tags = [] } = useQuery({
    queryKey: ["TAGS"],
    queryFn: async ({ signal }) => {
      const url = new URL("/api/tags", TEMPLATE_API_HOST);
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }

      return response.json() as Promise<string[]>;
    }
  });

  const [showAll, setShowAll] = React.useState(false);

  const [tagSearch, setTagSearch] = React.useState("");

  const tagList =
    showAll || tagSearch.trim()
      ? tags.filter((tag) => tag.includes(tagSearch))
      : tags.slice(0, 10);

  return (
    <form
      className="flex flex-col gap-2"
      onChange={(e) => {
        const data = new FormData(e.currentTarget);
        onTagSelectChange(data.getAll("tags").map((t) => t.toString()));
      }}
    >
      <h3 className="text-lg">Tags</h3>

      <Input
        placeholder="search tags"
        className="py-1"
        type="search"
        value={tagSearch}
        onChange={(ev) => {
          setTagSearch(ev.currentTarget.value);
        }}
      />

      <ul className="flex flex-col pl-0 list-none gap-1">
        {tagList.map((tag) => (
          <li key={tag} className="flex items-center gap-1">
            <input
              type="checkbox"
              id={`tags-${tag}`}
              name="tags"
              value={tag}
              checked={selectedTags.includes(tag)}
            />
            <label htmlFor={`tags-${tag}`} className="m-0 w-full">
              {tag}
            </label>
          </li>
        ))}
      </ul>
      {!tagSearch.trim() && (
        <Button
          className="px-2 py-1 gap-1 rounded-full bg-(--sl-color-accent)! text-(--sl-color-black)"
          type="button"
          onClick={() => {
            setShowAll((prev) => !prev);
            if (showAll) {
              const main = document.querySelector("main");
              main?.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });
            }
          }}
        >
          Show {!showAll ? "all" : "less"}
          {!showAll ? (
            <ChevronRightIcon className="size-4" />
          ) : (
            <ChevronUpIcon className="size-4" />
          )}
        </Button>
      )}
    </form>
  );
}

function TemplateCard({ document: doc }: { document: TemplateDocument }) {
  const logoUrl = new URL(doc.logoUrl, TEMPLATE_API_HOST);
  return (
    <div
      className={cn(
        "h-full w-full relative border flex flex-col gap-3 py-4 m-0",
        "border-border  bg-(--sl-color-bg-nav) dark:bg-bg hover:dark:bg-(--sl-color-grey-6)",
        "hover:border-(--sl-color-white) transition-colors focus-within:dark:bg-(--sl-color-grey-6) focus-within:border-(--sl-color-white)",
        "hover:bg-(--sl-color-gray-6)",
        "rounded-lg shadow-sm min-h-40"
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
