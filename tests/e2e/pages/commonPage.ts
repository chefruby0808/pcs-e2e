/// <reference types = "cypress" />
let YAML = require('yamljs')
let path = require('path')

import networkData from '../configs/network'

export class CommonPage {
  elementYml: object
  envVariable = Cypress.env()
  
  constructor(elementYml) {
      this.elementYml = elementYml
  }

  route = {
    targetUrl: '/'
  }

  switchToTargetPage() {
      throw new Error(
        `You have to implement the method 'switchToTargetPage' on your own class`
      )
    }
  
  go() {
    this.switchToTargetPage()
    cy.initPlaywright()
    return this
  }

  getElement(locator, timeout=30000) {
    cy.log(`---Start to Locate ${JSON.stringify(locator)} now---`)
    if (locator['locator']) {
      locator = locator['locator']
    }
    
    return cy.get(locator,{ timeout : timeout })
  }

  getNetWorkData(name = 'BNB Smart Chain'){
    var network = networkData['network']
 
    return network.filter(item => {return item.networkName === name})
  }

  switchNetwork(description) {
    var networkItem = this.getNetWorkData(description)[0]
    cy.wait(1000)
    cy.changeNetwork(description, networkItem.networkName, networkItem.chain, this.route.targetUrl).then(() => {
      cy.visit(this.route.targetUrl)
    })
   
    return this
  }

  confirmMetaMask(confirm = true, gasconfig = undefined) {
    if (confirm == true) {
      cy.confirmTransaction()
      cy.contains("Transaction Submitted").should('be.visible')
      cy.get("button").contains('Close').click()
    }
    else {
      cy.rejectTransaction()
      cy.contains("Transaction rejected").should('be.visible')
      cy.get("button").contains('Dismiss').click()
    
    }  
  }

}
