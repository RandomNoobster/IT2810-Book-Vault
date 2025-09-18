// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { getTestUserUUID, getTestUserSecret } from '../utils/getTestUserCredentials';

// Overwrite the default `visit` command to set the localStorage to the test user
Cypress.Commands.overwrite(
  'visit',
  (originalFn: typeof cy.visit, url: string, options: Partial<Cypress.VisitOptions> = {}) => {
    const defaultOptions: Partial<Cypress.VisitOptions> = {
      onBeforeLoad: (window) => {
        window.localStorage.setItem('UUID', getTestUserUUID());
        window.localStorage.setItem('secret', getTestUserSecret());

        if (options.onBeforeLoad) {
          options.onBeforeLoad(window);
        }
      },
    };

    const mergedOptions = { ...options, ...defaultOptions };

    // Call original with proper types
    return originalFn(url, mergedOptions as Cypress.VisitOptions);
  },
);
