describe("PATCH /api/admin/events/:id", () => {
  // ... other tests ...

  test("401 - PATCH: responds with error when not authenticated", async () => {
    const eventToUpdate = {
      title: "Updated Event",
      description: "Updated description",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      end_date: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ),
      capacity: 50,
      location_name: "Updated Location",
      location_address: "Updated Address",
      event_type_id: 1,
    };

    const response = await request(app)
      .patch("/api/admin/events/1") // Changed from .put to .patch
      .send(eventToUpdate);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("You need to be signed in");
  });
});
