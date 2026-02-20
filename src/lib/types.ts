export type TemplateDocument = {
  id: string;
  name: string;
  description: string;
  url: string;
  tags: string[];
  logoUrl: string;
};

export type TextMatchInfo = {
  best_field_score: string;
  best_field_weight: number;
  fields_matched: number;
  num_tokens_dropped: number;
  score: string;
  tokens_matched: number;
  typo_prefix_score: number;
};

export type TemplateHit = {
  document: TemplateDocument;
  highlight: Record<string, never>;
  highlights: unknown[];
  text_match: number;
  text_match_info: TextMatchInfo;
};

export type SearchRequestParams = {
  collection_name: string;
  first_q: string;
  per_page: number;
  q: string;
};

export type TemplateSearchAPIResponse = {
  facet_counts: unknown[];
  found: number;
  hits: TemplateHit[];
  out_of: number;
  page: number;
  request_params: SearchRequestParams;
  search_cutoff: boolean;
  search_time_ms: number;
};

export type TemplateDetailsApiResponse = {
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
