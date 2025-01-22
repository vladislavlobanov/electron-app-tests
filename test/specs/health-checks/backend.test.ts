describe("Backend health check", () => {
  it("should return up state", async () => {
    const response = await fetch("http://127.0.0.1:5001/api/health");
    const health = await response.json();
    expect(health.message).toBe("OK");
    expect(health.uptime).toBeGreaterThan(0);
  });
});
