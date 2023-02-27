// / <reference types="Cypress" />

import { CommonPage } from '../commonPage'

export class SwapPage extends CommonPage {
  elementYml: any
  gasConfig = undefined
  timeOut = this.envVariable.timeOut
  constructor(elementYml) {
      super(elementYml);
  }

  route = {
      targetUrl: '/swap'
  }

  switchToTargetPage() {
      cy.visit(this.route.targetUrl)
      cy.get("a[href='/swap']").should('be.visible')
      return this
  }

  get swapFromAmount() {
    return this.getElement(this.elementYml.swapFromAmount)
  }

  get swapInput() {
    return this.getElement(this.elementYml.swapInput)
  }

  get swapOutput() {
    return this.getElement(this.elementYml.swapOutput)
  }

  get swapButton() {
    return this.getElement(this.elementYml.swapButton)
  }

  get confirmButton() {
    return this.getElement(this.elementYml.confirmButton)
  }

  get swapInputToken() {
    return this.getElement(this.elementYml.swapInputToken)
  }

  get swapOutputToken() {
    return this.getElement(this.elementYml.swapOutputToken)
  }

  get tokenSearchInput() {
    return this.getElement(this.elementYml.tokenSearchInput)
  }

  get tokenSearchResult() {
    return this.getElement(this.elementYml.tokenSearchResult)
  }

  get settingButton() {
    return this.getElement(this.elementYml.settingButton)
  }

  get inputSlippagetext() {
    return this.getElement(this.elementYml.inputSlippagetext)
  }

  get closeButton() {
    return this.getElement(this.elementYml.closeButton)
  }

  changeSettings(percent='5') {
    cy.contains('Slippage Tolerance').siblings('div[color="primary"]').invoke('text').then(text => {
      if(text != `${percent}%`)
      {
        this.settingButton.click()
        cy.contains("Settings").should('be.visible')
        this.inputSlippagetext.eq(0).type(percent)
        this.closeButton.click()
      }
    })
  }

  async swapToken(input="", output="", fromToken = "tBNB", toToken = "CAKE", confirm = true) {
    this.swapFromAmount.should('not.contain', 'Loading')
    this.changeToken(fromToken, toToken)
    if(input)
      this.swapInput.type(input, {force: true})
    if(output)
      this.swapOutput.type(output, {force: true})
    this.clickSwapButton(fromToken)
    this.confirmMetaMask(confirm);
  }

  clickSwapButton(fromToken) {
    cy.wait(this.timeOut)
    this.swapButton.then(($swapBtn) => {  
      if($swapBtn.prop('disabled')){
        if(!fromToken.includes('0x'))
         cy.get('button').contains(`Enable ${fromToken}`).should('be.visible')
        cy.get('button').contains(`Enable`).click()
        cy.wait(this.timeOut)
        cy.confirmTransaction()
        this.swapButton.should('not.be.disabled')
      }
    })
    this.swapButton.invoke('text').then (text => {
      this.swapButton.click({timeout: 3000})
      if(text == "Swap Anyway")
      {
        cy.window().then(function(p){
          cy.stub(p, "prompt").returns ("confirm")
        })
      }
    })
    this.confirmButton.click()
  }

  searchToken(token) {
    cy.contains('Select a Token').should('be.visible')
    let tokenSearch = ((token == "tBNB") ? "BNB" : token)
    this.tokenSearchInput.type(tokenSearch, {force: true}).then(() => {
      if(!token.includes("0x"))
      {
        this.tokenSearchResult.should('be.visible')
        cy.wait(this.timeOut)
        this.tokenSearchResult.eq(0).find('div[color="text"]').should('contain', token)
        this.tokenSearchResult.eq(0).click({force:true})
        this.closeButton.click({force:true})
      }
      else
        this.importToken()  
    })
    
  }

  changeToken(fromToken, toToken) {
    fromToken = (!fromToken ? "tBNB" : fromToken)
    toToken = (!toToken ? "CAKE" : toToken)
    this.swapInputToken.invoke('text').then ((text) => {
      if(!fromToken.includes(text)){
        this.swapInputToken.click()
        this.searchToken(fromToken)
      }
      this.swapOutputToken.invoke('text').then ((text) => {
        if(!toToken.includes(text)) {
          this.swapOutputToken.click()
          this.searchToken(toToken)
        }
      })
    })
  }

  importToken() {
    cy.get('div[color="textDisabled"]').then(($display) => {
      if($display.length == 1)
      {
        cy.wait(this.timeOut)
        cy.get('button').contains('Import').click({force: true})
        cy.get('input[name="confirmed"]').click({force: true})
        cy.contains("Import Tokens").should('be.visible')
        cy.get('button').contains('Import').click()
      }
      else
      {
        this.tokenSearchResult.should('be.visible')
        cy.wait(this.timeOut)
        this.tokenSearchResult.eq(0).click({force:true})
        this.closeButton.click({force:true})
      }

    })
  }
}
