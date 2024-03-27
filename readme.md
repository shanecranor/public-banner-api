# Public Banner API Documentation

The `BannerAPI` class provides a structured interface for interacting with a Banner 9 server, allowing for basic operation, retrieving terms, subjects, and searching courses. It utilizes Axios for making HTTP requests and helps manage session tokens. Responses have typescript types for easy integration with typescript projects.

## Usage Example

```javascript
async function simpleDemo() {
  const banner = new BannerAPI(
    "https://nubanner.neu.edu/StudentRegistrationSsb/ssb"
  );
  // fetch terms
  const terms = await banner.getTerms();
  // expect terms to be an array with at least one element
  console.log(terms);
  //init search for courses in the first term
  await banner.initSearch(terms[0].code);
  //search all courses with that term code
  const searchResults = await banner.searchCourses({
    txt_term: terms[0].code,
    // sortColumn: "subjectDescription",
  });
  console.log(searchResults);
}
```

## Class Initialization

```javascript
const apiClient = new BannerAPI(baseURL);
```

- `baseURL`: The url for the banner server. The URL varies by college but it likely follows this general format `bannername.school.edu/StudentRegistrationSsb/ssb`

## Methods

### `getTerms(options: Options): Promise<Term[]>`

Retrieves a list of terms based on the provided query parameters. Does not require a session token.

- **Parameters**:
  - `options` (Optional): Object containing `offset`, `max`, and `searchTerm`.
- **Returns**: A promise that resolves to an array of terms.

### `getSubjects(termId: string, options: Options): Promise<Subject[]>`

Fetches subjects for a specified term ID with optional search filtering. Does not require a session token.

- **Parameters**:
  - `termId`: The term ID for which to search subjects.
  - `options`: Object containing `searchTerm`, `offset`, and `max`.
- **Returns**: A promise that resolves to an array of subjects.

### `initSearch(termId: number): Promise<boolean>`

Initializes a search session for a specific term ID, creating a session token that authorizes `searchCourses`

- **Parameters**:
  - `termId`: The term ID to initialize the search with.
- **Returns**: A promise that resolves to a boolean indicating if the request was successful.

### `searchCourses(params, options?): Promise<SearchResponse>`

Conducts a detailed search for courses based on specific criteria. This method can filter courses by subject, course number, term, and more. It can also handle pagination and sorting of the search results.

#### Parameters

- **`params`: Object** - Specifies the criteria for filtering the course search.

  - `txt_subject` (optional): The subject code to filter courses (e.g., "CS" for Computer Science).
  - `txt_courseNumber` (optional): The course number to further refine the search (e.g., 101).
  - `txt_term`: The term ID to search within (e.g., 202480). This parameter is required and must match the term ID initialized with `initSearch`.
  - `startDatepicker` (optional)
  - `endDatepicker` (optional)
  - `pageOffset` (optional): The offset for pagination, useful for fetching courses in chunks.
  - `pageMaxSize` (optional): The maximum number of courses to return in one response. Must be between 1 and 500.
  - `sortColumn` (optional): The column to sort the search results by.
  - `sortDirection` (optional): The direction for sorting, either `"asc"` for ascending or `"desc"` for descending.

- **`options` (Optional): Object** - Additional options for the course search.

  - `initSearch`: A boolean for choosing to auto init the search by calling `initSearch` with the txt_term, this is false by default

- **Returns**:
  - **`Promise<SearchResponse>`**: A promise that, when resolved, returns a `SearchResponse` object containing the results of the search operation. This object includes details such as the total count of found courses, pagination details, and an array of courses that match the search criteria.

<!--

not 100% sure on this

### `resetForm(): Promise<boolean>`

Resets any data from the last search to allow for a new search operation.

- **Returns**: A promise that resolves to a boolean indicating whether the form was successfully reset. -->

### `bannerFetch(method, endpoint, queryParams, headers, body): Promise<any>`

Internal method for making HTTP requests to the API, including handling of session tokens and parsing of responses.

- **Parameters**:
  - `method`: The HTTP method to use ("GET" or "POST").
  - `endpoint`: The specific endpoint to target for the data fetch.
  - `queryParams`: Query parameters to append to the request URL.
  - `headers`: Additional HTTP headers for the request.
  - `body`: The request body, applicable for "POST" method.
- **Returns**: A promise that resolves to the parsed response data.

## Types

### `Term`

Represents a registration term, consisting of a term id (code) and description

Example Term object:

```json
{
  "code": 202460,
  "description": "Summer 2 2024 Semester"
}
```

### `Subject`

Describes a subject object, with subject code string and full description

Example Subject object:

```json
{
  "code": "CHME",
  "description": "Chemical Engineering"
}
```

### `SearchResponse`

TODO: document me
