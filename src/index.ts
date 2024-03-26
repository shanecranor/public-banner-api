import { Term, Subject } from "./bannerResponseTypes";

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
  lastSearchTerm: string;
  /**
   * Creates an instance of the API client.
   * @param baseURL - The base URL of the API.
   */
  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.sessionToken = "";
    this.lastSearchTerm = "";
  }

  /**
   * Retrieves terms based on the provided query parameters.
   *
   * @param options - The query parameters for retrieving terms.
   * @param options.offset - The page offset.
   * @param options.max - The page size.
   * @param options.searchTerm - An optional search term.
   * @returns A promise that resolves to an array of terms.
   */
  async getTerms(options: TermQueryParams): Promise<Term[]> {
    const queryParams = {
      offset: options.offset.toString(),
      max: options.max.toString(),
      searchTerm: options.searchTerm,
    };
    const response = await this.bannerFetch(
      "GET",
      "/classSearch/getTerms",
      queryParams
    );
    return response;
  }

  /**
   * Retrieves subjects based on the provided query parameters. Does not require a session token.
   *
   * @param options - The query parameters for retrieving subjects.
   * @param options.term - The term ID for which to search.
   * @param options.searchTerm - An optional search term.
   * @param options.offset - The page offset.
   * @param options.max - The page size.
   * @returns A promise that resolves to an array of subjects.
   */
  async getSubjects(options: SubjectQueryParams): Promise<Subject[]> {
    const queryParams = {
      term: options.term,
      searchTerm: options.searchTerm,
      offset: options.offset.toString(),
      max: options.max.toString(),
    };
    const response = await this.bannerFetch(
      "GET",
      "/classSearch/get_subject",
      queryParams
    );
    return response;
  }

  /**
   * Initializes a search with the specified term. Creates/Auths a session token.
   *
   * @param options - The search options.
   * @param options.term - The search term ID.
   * @returns A promise that resolves to a boolean indicating if the request was successful.
   */
  async initSearch(options: { term: number }): Promise<boolean> {
    const queryParams = {
      term: options.term.toString(),
    };
    const response = await this.bannerFetch(
      "POST",
      "/term/search",
      queryParams
    );
    const lastSearchTerm = options.term.toString();
    // TODO: make this less bad
    return Boolean(response);
  }

  //TODO: Contact card

  //   async getContactCard(options: {
  //     bannerId: number;
  //     termCode: number;
  //   }): Promise<TODO> {
  //     const queryParams = {
  //       bannerId: options.bannerId.toString(),
  //       termCode: options.termCode.toString(),
  //     };

  //     const response = await this.bannerFetch(
  //       "GET",
  //       "/contactCard/retrieveData",
  //       queryParams
  //     );
  //     throw new Error("Not yet implemented");
  //     return response;
  //   }

  // Main search function
  public async searchCourses(
    params: {
      txt_subject?: string;
      txt_courseNumber?: number;
      txt_term: number;
      startDatepicker: string;
      endDatepicker?: string;
      pageOffset?: number;
      pageMaxSize?: number;
      sortColumn?: string;
      sortDirection?: "asc" | "desc";
    },
    options?: { initSearch: boolean }
  ): Promise<any> {
    const defaultParams = {
      txt_subject: "",
      txt_courseNumber: "",
      startDatepicker: "",
      endDatepicker: "",
      pageOffset: 1,
      pageMaxSize: 10,
      sortColumn: "",
      sortDirection: "asc",
    };
    const queryParams = { ...defaultParams, ...params };
    // convert query params to strings
    const stringQueryParams = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, value.toString()])
    );
    // set the search term
    if (options?.initSearch) {
      await this.initSearch({ term: params.txt_term });
    }
    if (this.lastSearchTerm !== params.txt_term.toString()) {
      throw Error(
        "Search courses 'txt_term' does not match the initialized search term. Please call initSearch() first."
      );
    }
    // Perform the course search
    return await this.bannerFetch(
      "GET",
      "/searchResults/searchResults",
      stringQueryParams,
      { Cookie: this.sessionToken }
    );
  }

  /**
   * Resets input from the last search search so you can make a new search.
   * @returns A promise that resolves to a boolean indicating whether the form was successfully reset.
   */
  async resetForm(): Promise<boolean> {
    const response = await this.bannerFetch(
      "POST",
      "/classSearch/resetDataForm"
    );
    return Boolean(response);
  }

  /**
   * Fetches banner data from the specified endpoint using the provided method and parameters. Sets the session token if it is returned in the response.
   * @param method - The HTTP method to use for the request (GET or POST for now).
   * @param endpoint - The endpoint to fetch data from.
   * @param queryParams - The query parameters to include in the request URL.
   * @param headers - Optional additional headers to include in the request.
   * @returns A Promise that resolves to the parsed response data.
   * @throws If the request fails or the response has an unsupported Content-Type.
   */
  async bannerFetch(
    method: "GET" | "POST",
    endpoint: string,
    queryParams: Record<string, string> = {},
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
