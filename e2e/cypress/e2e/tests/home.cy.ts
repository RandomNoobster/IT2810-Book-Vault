describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display correct information', () => {
    cy.get('header').should('be.visible');
    cy.get('h1').contains('Welcome to');

    // Check stats group
    cy.get('[aria-live="polite"]').should('have.length', 3);
    cy.get('[aria-live="polite"]').eq(0).should('not.contain', '. . .').contains(/\d+/);
    cy.get('[aria-live="polite"]').eq(1).should('not.contain', '. . .').contains(/\d+/);
    cy.get('[aria-live="polite"]').eq(2).should('not.contain', '. . .').contains(/\d+/);
  });

  it('random book function should redirect', () => {
    cy.contains('Try your luck with a random book').should('not.have.attr', 'data-loading'); // Wait for the button to be enabled
    cy.contains('Try your luck with a random book').click();

    cy.url().should('include', '/books/');
  });

  it('popular genres should redirect', () => {
    cy.contains('Drama').click();
    cy.url().should('include', '/books?genres=Drama');
  });
});
