import fetchMock from "jest-fetch-mock";
import { banner9Simulator } from "./banner9Simulator";
import { BannerAPI } from "..";
import { GET_TERMS } from "./sampleResponses2024";

// fetchMock.enableMocks();

describe("API Fetch Tests", () => {
  // beforeEach(() => {
  //   fetchMock.resetMocks(); // Reset mocks before each test
  //   fetchMock.mockIf((request: Request) => {
  //     const url = new URL(request.url);
  //     return url.hostname === "banner-test.com";
  //   }, banner9Simulator);
  // });

  it("fetch data from real banner API", async () => {
    const banner = new BannerAPI(
      "https://nubanner.neu.edu/StudentRegistrationSsb/ssb"
      // "https://bannerssb9.mines.edu/StudentRegistrationSsb/ssb"
    );
    // a new banner object should have no session tokens
    expect(banner.sessionTokens).toHaveLength(0);
    // fetch terms
    const terms = await banner.getTerms();
    // expect terms to be an array with at least one element
    expect(terms.length).toBeGreaterThan(0);
    expect(banner.sessionTokens).toHaveLength(2);
    //init search for courses in the first term
    await banner.initSearch(terms[0].code);
    //search all courses with that term code
    const searchResults = await banner.searchCourses({
      txt_term: terms[0].code,
      // sortColumn: "subjectDescription",
    });
    expect(searchResults).toBeDefined();
    expect(searchResults.totalCount).toBeGreaterThan(0);
  });
});
