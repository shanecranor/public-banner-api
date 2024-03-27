import { Term, Subject } from "./bannerResponseTypes";

async function testFetch() {
  const initSearch = await fetch(
    "https://bannerssb9.mines.edu/StudentRegistrationSsb/ssb/term/search?mode=search",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        // "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: "term=202480&studyPath=&studyPathText=&startDatepicker=&endDatepicker=",
      method: "POST",
    }
  );
  // extract cookies
  const cookies = initSearch.headers.get("set-cookie");
  console.log("cookies");
  console.log(cookies);
  const searchResponse = await fetch(
    //"https://banner-9.mines.rocks/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_term=202480&startDatepicker=&endDatepicker=&pageOffset=0&pageMaxSize=10&sortColumn=subjectDescription&sortDirection=asc",
    "https://bannerssb9.mines.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_term=202480&startDatepicker=&endDatepicker=&pageOffset=0&pageMaxSize=10&sortColumn=subjectDescription&sortDirection=asc",
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        cookie: cookies || "",
        //"JSESSIONID=C5369E5ABC31247A733A2C31A84425AD; Path=/StudentRegistrationSsb; HttpOnly; Secure, BIGipServerbanner-ssb-prod-01_pool=!A4ncBNnch0I5PpIO13Cp8v0Ue2fC1aLEYHswudLztfhs1rMF+xALc4lJnrM/spK53h+tGigeeK9UDHU=  path=/; Httponly; Secure",
        Referer:
          "https://bannerssb9.mines.edu/StudentRegistrationSsb/ssb/classSearch/classSearch",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  );
  const data = await searchResponse.json();
  console.log(data);
}

testFetch();
export type Options = {
  offset?: number;
  max?: number;
  searchTerm?: string;
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
  ): Promise<any> {
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
        Cookie: this.sessionToken,
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

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          ...headers,
          Cookie: this.sessionToken,
        },
        body,
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
