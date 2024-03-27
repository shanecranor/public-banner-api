import { Term, Subject, SearchResponse } from "./bannerResponseTypes";
import axios, { AxiosRequestConfig, Method } from "axios";

export type Options = {
  offset?: number;
  max?: number;
  searchTerm?: string;
};

export class BannerAPI {
  baseURL: string;
  sessionTokens: string[];
  lastSearchTerm: string;
  /**
   * Creates an instance of the API client.
   * @param baseURL - The base URL of the API.
   */
  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.sessionTokens = [];
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
  async getTerms(options: Options = {}): Promise<Term[]> {
    const { offset = 1, max = 10, searchTerm = "" } = options;
    const queryParams = {
      offset: offset.toString(),
      max: max.toString(),
      searchTerm: searchTerm,
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
   * @param termId - The term ID for which to search.
   * @param options - The query parameters for retrieving subjects.
   * @param options.searchTerm - An optional search term.
   * @param options.offset - The page offset.
   * @param options.max - The page size.
   * @returns A promise that resolves to an array of subjects.
   */
  async getSubjects(termId: string, options: Options): Promise<Subject[]> {
    const { searchTerm = "", offset = 1, max = 10 } = options;
    const queryParams = {
      term: termId,
      searchTerm: searchTerm,
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

  /**
   * Initializes a search with the specified term. Creates/Auths a session token.
   *
   * @param termId - The search term ID.
   * @returns A promise that resolves to a boolean indicating if the request was successful.
   */
  async initSearch(termId: number): Promise<boolean> {
    const formData = new FormData();
    formData.append("term", termId.toString());

    const response = await this.bannerFetch(
      "POST",
      "/term/search",
      {},
      {},
      formData
    );
    this.lastSearchTerm = termId.toString();
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
      startDatepicker?: string;
      endDatepicker?: string;
      pageOffset?: number;
      pageMaxSize?: number;
      sortColumn?: string;
      sortDirection?: "asc" | "desc";
    },
    options?: { initSearch: boolean }
  ): Promise<SearchResponse> {
    const defaultParams = {
      txt_subject: "",
      txt_courseNumber: "",
      startDatepicker: "",
      endDatepicker: "",
      pageOffset: 0,
      pageMaxSize: 10,
      sortColumn: "",
      sortDirection: "asc",
    };

    const queryParams = { ...defaultParams, ...params };

    if (queryParams.pageMaxSize < 1 || queryParams.pageMaxSize > 500) {
      throw Error("pageMaxSize must be between 1 and 500");
    }
    // set the search term
    if (options?.initSearch) {
      await this.initSearch(queryParams.txt_term);
    }
    // convert query params to strings
    const stringQueryParams = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, value.toString()])
    );

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
      {
        Accept: "application/json, text/javascript, */*; q=0.01",
      }
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
    headers: Record<string, string> = {},
    body: FormData | string | undefined = undefined
  ) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(queryParams).forEach((key) =>
      url.searchParams.append(key, queryParams[key])
    );

    // Prepare the Axios request configuration
    const config: AxiosRequestConfig = {
      method: method as Method,
      url: url.toString(),
      headers: {
        ...headers,
        cookie: this.sessionTokens,
      },
      // For GET requests, the body should not be set. Axios uses `data` for the request body.
      data: method === "POST" ? body : undefined,
      // Axios automatically parses JSON responses, so no need to check Content-Type manually.
    };

    try {
      const response = await axios(config);

      const setCookieHeader = response.headers["set-cookie"];
      if (setCookieHeader) {
        this.sessionTokens = setCookieHeader;
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch from ${url}: ${error.message}`);
      } else {
        throw new Error(`An unknown error occurred while fetching from ${url}`);
      }
    }
  }
}
