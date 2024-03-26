import { BannerAPI } from "..";

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
  (global.fetch as jest.Mock).mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: "mocked data" }), // Mock response data
    })
  );
});

describe("api tests", () => {
  it("should fetch data", async () => {
    const api = new BannerAPI("http://example.com");
    const response = await api.bannerFetch("GET", "/endpoint");
    expect(response).toEqual({ data: "mocked data" });
  });
});
