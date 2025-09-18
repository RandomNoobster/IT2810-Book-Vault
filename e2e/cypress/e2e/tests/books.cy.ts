describe('Books Page', () => {
  beforeEach(() => {
    cy.visit('/books');
  });

  it('should display correct information', () => {
    cy.get('header').should('be.visible');
    cy.get("a[href*='/books/']").should('have.length.greaterThan', 0);
  });

  it('changing the number of entries should work', () => {
    // Select 12 entries
    cy.get('[data-testid="entries-select"]').click();
    cy.get('.mantine-Select-options').contains('12').click();
    cy.get("a[href*='/books/']").should('have.length', 12);

    // Select 24 entries
    cy.get('[data-testid="entries-select"]').click();
    cy.get('.mantine-Select-options').contains('24').click();
    cy.get("a[href*='/books/']").should('have.length', 24);
  });

  it('pagination should work', () => {
    // Start on page 1
    cy.get('[data-active="true"]').contains('1');

    // Click on page 2
    cy.get('.mantine-Pagination-root').contains('2').click();
    cy.get('[data-active="true"]').contains('2');
    cy.url().should('include', 'page=2');
  });

  it('searching for a book should work', () => {
    // Search for the hunger games
    cy.wait(1000); // If we search immediately, the initial queries will be cancelled, and cypress will still say it is waiting for the cancelled queries
    cy.get('input[placeholder="Search for books"]').type('The Hunger Games{enter}');

    cy.get('p').contains('The Hunger Games');
    cy.get("[title='Suzanne Collins']").should('be.visible');
  });

  it('filtering should work and display correct results', () => {
    cy.get('button[aria-label="Open search configuration"]').click();

    let numberOfResults;

    // Wait for load
    cy.get('.mantine-Radio-root')
      .eq(5)
      .find('.mantine-Radio-labelWrapper')
      .should('not.have.attr', 'data-disabled');

    // Get the number of results
    cy.get('.mantine-Radio-root')
      .eq(5)
      .find('.mantine-Text-root')
      .then(($p) => {
        numberOfResults = $p.text();
      });

    // Click on the radio button
    cy.get('.mantine-Radio-body').eq(5).click();

    cy.get('.mantine-CloseButton-root.mantine-Drawer-close').click();

    // Check if the number of results is correct
    cy.get('[data-testid="number-of-results"]')
      .should('not.contain', 'Loading')
      .should(($text) => {
        expect($text.text()).to.equal(`${numberOfResults} results`);
      });
  });
});
