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

Conducts a course search with a comprehensive set of parameters.

- **Parameters**:
  - `params`: Object containing various search parameters like `txt_subject`, `txt_courseNumber`, `txt_term`, etc.
  - `options` (Optional): Object with `initSearch` indicating whether to initialize a search session.
- **Returns**: A promise that resolves to the search response.

### `resetForm(): Promise<boolean>`

Resets any data from the last search to allow for a new search operation.

- **Returns**: A promise that resolves to a boolean indicating whether the form was successfully reset.

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
