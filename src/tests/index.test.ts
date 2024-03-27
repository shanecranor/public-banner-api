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

  it("should fetch data successfully", async () => {
    //wait 10 seconds
    setTimeout(() => {
      console.log("Waiting 10 seconds");
    }, 10000);
  });
});

// const banner = new BannerAPI(
//   // "https://nubanner.neu.edu/StudentRegistrationSsb/ssb"
//   "https://bannerssb9.mines.edu/StudentRegistrationSsb/ssb"
// );
// const terms = await banner.getTerms();
// console.log(terms);
// expect(terms).toBeDefined();
// console.log(banner.sessionToken);
// console.log(terms[0]);
// //init search
// await banner.initSearch(202480);
// //search courses
// const searchResults = await banner.searchCourses({
//   txt_term: 202480,
//   sortColumn: "subjectDescription",
//   // txt_subject: "CS",
// });
// console.log(searchResults);
