describe('Single Book Page', () => {
  beforeEach(() => {
    cy.visit('/books/3263607-the-fellowship-of-the-ring');
  });

  it('should display correct information', () => {
    cy.get('header').should('be.visible');
    cy.get('h1').contains('The Fellowship of the Ring').should('be.visible');
    cy.get('.mantine-Text-root').contains('J.R.R. Tolkien').should('be.visible');
    cy.get('.mantine-Text-root').contains('9780345015339').should('be.visible');
    cy.get('.mantine-Rating-root').should('be.visible');
    cy.get('.mantine-Spoiler-control').click();
  });

  it('reviews should work', () => {
    cy.get('.mantine-Text-root').contains('Reviews');
    cy.get('button[aria-label="Give Review"], button[aria-label="Edit Review"]').click();
    cy.get('.mantine-Rating-input[aria-label="5"]').parent().click();
    cy.get('textarea')
      .clear()
      .type(
        "Forget dragons, I'm here for the hobbits, second breakfast, and questionable decisions.",
      );
    cy.get('button[aria-label="Submit Review"], button[aria-label="Update Review"]').click();
  });

  it('should be able to load more reviews', () => {
    cy.get('[data-testid="profileReview-stack"]')
      .find('> * > .mantine-Grid-col')
      .should('have.length', 3);
    cy.get('button').contains('Load more').click();
    cy.get('[data-testid="profileReview-stack"]')
      .find('> * > .mantine-Grid-col')
      .should('have.length', 6);
  });
});
