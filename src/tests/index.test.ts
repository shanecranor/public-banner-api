import { helloWorld } from "../index";

describe("helloWorld Function", () => {
  it('should return "Hello, World!"', () => {
    expect(helloWorld()).toBe("Hello World");
  });
  // it("should cry ", async () => {
  //   const response = await fetch(
  //     "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/term/search?term=202510"
  //   );
  //   expect(response.status).toBe(200);
  //   console.log(response.headers.get("set-cookie"));
  // });
});
