import { helloWorld } from "../index";

describe("helloWorld Function", () => {
  it('should return "Hello, World!"', () => {
    expect(helloWorld()).toBe("Hello World");
  });
});
