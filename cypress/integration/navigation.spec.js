describe("Navigation", () => {

  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
   });

  it("should visit root", () => {
    cy.visit("/");
  });

});