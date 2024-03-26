import { Term, Subject } from "./bannerResponseTypes";

export function helloWorld() {
  console.log("Hello World");
  return "Hello World";
}

export type TermQueryParams = {
  offset: number;
  max: number;
  searchTerm: string;
};
export type SubjectQueryParams = {
  term: string;
  searchTerm: string;
  offset: number;
  max: number;
};
export class BannerAPI {
  baseURL: string;
  sessionToken: string;
  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.sessionToken = "";
  }
  //endpoints that do not require session tokens
  async getTerms({
    offset = 1,
    max = 10,
    searchTerm = "",
  }: TermQueryParams): Promise<Term[]> {
    const queryParams = {
      offset: offset.toString(),
      max: max.toString(),
      searchTerm,
    };
    const response = await this.bannerFetch(
      "GET",
      "/classSearch/getTerms",
      queryParams
    );
    return response;
  }

  async getSubjects({
    term,
    searchTerm = "",
    offset = 1,
    max = 10,
  }: SubjectQueryParams): Promise<Subject[]> {
    const queryParams = {
      term,
      searchTerm,
      offset: offset.toString(),
      max: max.toString(),
    };
    const response = await this.bannerFetch(
      "GET",
      "/classSearch/get_subject",
      queryParams
    );
    return response;
  }
  //gets the session token
  async initSearch({ term }: { term: string }): Promise<Boolean> {
    const queryParams = {
      term,
    };
    const response = await this.bannerFetch(
      "POST",
      "/term/search",
      queryParams
    );
    // TODO: make this less bad
    return Boolean(response);
  }

  async bannerFetch(
    method: "GET" | "POST",
    endpoint: string,
    queryParams: Record<string, string>,
    headers: Record<string, string> = {}
  ) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(queryParams).forEach((key) =>
      url.searchParams.append(key, queryParams[key])
    );

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          ...headers,
          Cookie: this.sessionToken,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Extract and store the session token from the response
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        this.sessionToken = setCookieHeader;
      }
      // Check the Content-Type header to determine how to parse the response
      const responseContentType = response.headers.get("Content-Type");

      if (!responseContentType) throw new Error("No Content-Type header");

      if (responseContentType.includes("application/json")) {
        return await response.json();
      } else if (responseContentType.includes("text/html")) {
        return await response.text();
      } else {
        throw new Error("Unsupported Content-Type");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch from ${url}: ${error.message}`);
      } else {
        throw new Error(`An unknown error occurred while fetching from ${url}`);
      }
    }
  }
}
