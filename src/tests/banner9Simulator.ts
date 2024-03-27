import { MockResponseInitFunction } from "jest-fetch-mock";
import { GET_TERMS } from "./sampleResponses2024";
export const banner9Simulator: MockResponseInitFunction = async (req) => {
  // Parse the request URL
  const url = new URL(req.url);

  // Use url.pathname to switch between API endpoints
  switch (url.pathname) {
    case "/StudentRegistrationSsb/ssb/classSearch/getTerms":
      // Simulating listing semesters
      return Promise.resolve({
        body: JSON.stringify(GET_TERMS),
        headers: { "Content-Type": "application/json" },
      });

    case "/StudentRegistrationSsb/ssb/classSearch/get_subject":
      // Extract query parameters if needed
      // const searchTerm = url.searchParams.get('searchTerm');
      return Promise.resolve({
        body: JSON.stringify([
          { code: "CS", description: "Computer Science" },
          { code: "MAT", description: "Mathematics" },
          // Add more subjects as needed
        ]),
        headers: { "Content-Type": "application/json" },
      });

    case "/StudentRegistrationSsb/ssb/term/search":
      // Simulating term search initialization
      return Promise.resolve({
        body: JSON.stringify({
          message: "Session initialized for term search",
        }),
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "sessionToken=12345; Path=/; HttpOnly",
        },
      });

    case "/StudentRegistrationSsb/ssb/searchResults/searchResults":
      // Simulating course search
      return Promise.resolve({
        body: JSON.stringify({
          success: true,
          data: [
            { id: 1, title: "Introduction to Computer Science", code: "CS101" },
            { id: 2, title: "Advanced Mathematics", code: "MAT202" },
            // Add more courses as needed
          ],
        }),
        headers: { "Content-Type": "application/json" },
      });

    default:
      // Default case for unhandled paths
      return Promise.resolve({
        status: 404,
        body: JSON.stringify({ message: "Not Found" }),
        headers: { "Content-Type": "application/json" },
      });
  }
};
