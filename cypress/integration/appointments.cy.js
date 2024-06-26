describe("Navigation", () => {

  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");

    cy.visit("/");

    cy.contains("Monday");
  });


  it('Should navigate to Tuesday', () => {
    cy.visit("/")

    cy.contains("[data-testid=day]", 'Tuesday')
      .click()
      .should('have.class', 'day-list__item--selected')
  })


  it('should book an interview', () => {
    /*--------Jose Way ----------------*/
    // cy.visit('/')

    // cy.contains('[data-testid=appointment]', '1pm')
    //   .click()

    // cy.get('.appointment__create-input')
    //   .type('Jose Eduardo')
    //   .should('have.value', 'Jose Eduardo')

    // cy.get('.interviewers__item-image[alt="Sylvia Palmer"]')
    //   .click()

    // cy.contains('.button--confirm', 'Save')
    //   .click()

    cy.visit("/");
    cy.contains("Monday");

    cy.get("[alt=Add]")
      .first()
      .click();

    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains("Save").click();

  })





  it('should edit an interview', () => {

    cy.get('[alt="Edit"]').click({ force: true })

    cy.get('[data-testid="student-name-input"]')
      .should('have.value', 'Archie Cohen')
      .clear()
      .type('Lydia Miller-Jones')

    cy.get('[alt="Tori Malcolm"]').click()
    cy.contains("Save").click()
  })

  it('should cancel an interview', () => {
    cy.get('[alt="Delete"]')
      .click({ force: true })

    cy.contains("Confirm").click()

    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    cy.contains(".appointment__card--show", 'Lydia Miller-Jones')
      .should("not.exist");
  })

});