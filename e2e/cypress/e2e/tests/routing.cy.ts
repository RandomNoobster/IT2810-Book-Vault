// Routing and traversal. This contains larger e2e tests.

describe('Larger E2E tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('a user should be able to navigate the whole website just based on the header', () => {
    // Change color theme
    cy.wait(200); // Wait for Mantine
    cy.get('[aria-label="Change color theme"]').click();

    // Click link with text 'Books'
    cy.get('a').contains('Books').click();
    cy.url().should('include', '/books');

    // Click link with text 'Home'
    cy.get('a').contains('Home').click();
    cy.url().should('include', '/');

    // Click profile link
    cy.get("a[href*='/profile']").click();
    cy.url().should('include', '/profile');

    // Click logo link
    cy.get("a[aria-label='Go to home page']").click();
    cy.url().should('eq', `${Cypress.config('baseUrl')}`);
  });

  it('a user should be able to traverse the whole website', () => {
    // Go to books
    cy.get('a').contains('Books').click();

    // Click link where the href contains `/books/`
    cy.get("a[href*='/books/']").first().click();
    cy.url().should('include', '/books/');
    cy.get('p').contains('Reviews');

    // Click profile link
    cy.get("a[href*='/profile']").click();
    cy.url().should('include', '/profile');
    cy.get('h1').contains('Your reviews');

    // Click logo link
    cy.get("a[aria-label='Go to home page']").click();
    cy.url().should('eq', `${Cypress.config('baseUrl')}`);
  });

  it('a user should be able to user filters to find the Hunger Games book and see all reviews', () => {
    // Go to books
    cy.get('a').contains('Books').click();

    // Change color theme
    cy.wait(200); // Wait for Mantine
    cy.get('[aria-label="Change color theme"]').click();

    // Filter the selection
    cy.get('button[aria-label="Open search configuration"]').click();

    // Wait for load
    cy.get('.mantine-Radio-root')
      .eq(5)
      .find('.mantine-Radio-labelWrapper')
      .should('not.have.attr', 'data-disabled');

    cy.get('.mantine-MultiSelect-label')
      .contains('Publisher')
      .parent()
      .find('input')
      .type('Scholastic Press');

    // Select Scholastic Press
    cy.get('.mantine-MultiSelect-option').contains('Scholastic Press').click();
    cy.get('body').type('{esc}'); // Close dropdown

    // Select Suzanne Collins
    cy.get('.mantine-MultiSelect-label')
      .contains('Authors')
      .parent()
      .find('input')
      .type('Suzanne Collins{enter}');
    cy.get('.mantine-MultiSelect-option').contains('Suzanne Collins').click();
    cy.get('body').type('{esc}'); // Close dropdown

    // Select Action
    cy.get('label').contains('Action').click();

    // Close filters
    cy.get('.mantine-CloseButton-root.mantine-Drawer-close').click();

    // Select hunger games
    cy.get('a[href*="/books/"]').contains('The Hunger Games').first().click();

    // Check the reviews
    cy.get('[data-testid="profileReview-stack"]')
      .find('> * > .mantine-Grid-col')
      .should('have.length', 3);
    cy.get('button').contains('Load more').click();
    cy.get('[data-testid="profileReview-stack"]')
      .find('> * > .mantine-Grid-col')
      .should('have.length', 6);
  });

  // This test assume that the test user has not written more than 3 reviews
  it('a user should be able to leave a review and find it in their profile', () => {
    const bookTitle = 'The Art of Computer Programming, Volume 1: Fundamental Algorithms';
    const reviewText =
      'There are only two hard things in Computer Science: cache invalidation and naming things.\n- Sun Tzu';

    // Go to books
    cy.get('a').contains('Books').click();

    // Go to a specific book
    cy.get('input[placeholder="Search for books"]').type(`${bookTitle}{enter}`);
    cy.get('a[href*="/books/"]').contains(bookTitle).first().click();
    cy.get('h1').contains(bookTitle).should('be.visible');

    // Start writing a review
    cy.get('button[aria-label="Give Review"], button[aria-label="Edit Review"]').click();

    // Write a review
    cy.get('.mantine-Rating-input[aria-label="5"]').parent().click();

    cy.get('textarea').clear().type(reviewText);

    // Post review
    cy.get('button[aria-label="Submit Review"], button[aria-label="Update Review"]').click();

    // Wait for the review to be posted and retrieved
    cy.get('h4').contains('Your review').should('be.visible');

    // Find review on profile page
    cy.get('a[href*="/profile"]').click();
    cy.get(`a[aria-label*="${bookTitle}"]`).click();

    // Check that we can go back to the original book
    cy.url().should('include', '/books/');
    cy.get('h1').contains(bookTitle).should('be.visible');
    cy.get('h4').contains('Your review').should('be.visible').scrollIntoView();
  });
});
