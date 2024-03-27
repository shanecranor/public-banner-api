require("jest-fetch-mock").enableMocks();
//default fetch behavior should function as expected, only mocking fetch when needed
fetchMock.dontMock();
