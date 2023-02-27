/// <reference types="cypress" />


// ***********************************************
// This example commands.ts shows you how to
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

  const timeOut = 2000

  Cypress.Commands.add('initPlaywright', () => {
    return cy.task('initPlaywright');
  });

  Cypress.Commands.add('setUpMetamaskWallet', () => {
    return cy.task('setUpMetamaskWallet');
  });

  Cypress.Commands.add('approveMetamaskWallet', () => {
    return cy.task('approveMetamaskWallet');
  });

  Cypress.Commands.add('confirmTransaction', () => {
    return cy.task('confirmTransaction');
  });

  Cypress.Commands.add('rejectTransaction', () => {
    return cy.task('rejectTransaction');
  });

  Cypress.Commands.add('addSwitchNetWork', () => {
    return cy.task('addSwitchNetWork');
  });

  
  Cypress.Commands.add('connectWallet', () => { 
  
      const timeOut = 2000
      cy.visit('/')
      cy.contains('Connect Wallet').should('be.visible')
      cy.get('button').contains("Connect Wallet").click()
      cy.get('div').contains("Metamask").click()
      cy.approveMetamaskWallet()
    })

  Cypress.Commands.add('changeNetwork', (networkName = "BNB Smart Chain", networkType = "mainnet", chain = 'bsc', route ='/') => { 
    cy.get('div[display="none,,,,,block"]').invoke('text').then(text => {
      if(text != networkName)
        {
          if(networkType == "mainnet")
          {
            cy.get('div[display="none,,,,,block"]').click({force: true})
            cy.get('button').contains(networkName).should('be.visible')
            cy.get('button').contains(networkName).click({force: true})
          }
          else
          {
            cy.visit(`${route}/?chain=${chain}`)
            cy.contains(`Switch to ${networkName}`).click()
          }
          cy.addSwitchNetWork()

        }   
    })
   
  })

