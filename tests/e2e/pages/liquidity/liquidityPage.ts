// / <reference types="Cypress" />

import { CommonPage } from '../commonPage'

export class LiquidityPage extends CommonPage {
  elementYml: any
  gasConfig = undefined
  timeOut = this.envVariable.timeOut
  constructor(elementYml) {
      super(elementYml);
  }

  route = {
      targetUrl: '/liquidity'
  }

  switchToTargetPage() {
      cy.visit(this.route.targetUrl)
      cy.reload()
      cy.contains("Your Liquidity").should('be.visible') 
      return this
  }

  get addLiquidityButton() {
    return this.getElement(this.elementYml.addLiquidityButton)
  }

  get findLiquidityButton() {
    return this.getElement(this.elementYml.findLiquidityButton)
  }

  get firstPair() {
    return this.getElement(this.elementYml.firstPair)
  }

  get secondPair() {
    return this.getElement(this.elementYml.secondPair)
  }

  get tokenSearchInput() {
    return this.getElement(this.elementYml.tokenSearchInput)
  }

  get tokenSearchResult() {
    return this.getElement(this.elementYml.tokenSearchInput)
  }

  get addLiquidityPairButton() {
    return this.getElement(this.elementYml.addLiquidityPairButton)
  }

  get inputTokenAAmount() {
    return this.getElement(this.elementYml.inputTokenAAmount)
  }

  get inputTokenBAmount() {
    return this.getElement(this.elementYml.inputTokenBAmount)
  }

  get titleText() {
    return this.getElement(this.elementYml.titleText)
  }

  get liquidityTokenA() {
    return this.getElement(this.elementYml.liquidityTokenA)
  }

  async addLiquidity(tokenA, tokenB, amountA, amountB, network, confirm = true) {
    this.clickAddliquidityButton(network)
    this.changeToken(tokenA, tokenB, network)
    this.checkAddLiquidityTitle(tokenA, tokenB)
    this.liquidityTokenA.invoke('text').should('not.contain', 'Loading')
    if(amountA)
      this.inputTokenAAmount.type(amountA, {force: true})
    if(amountB)
      this.inputTokenBAmount.type(amountB, {force: true})
    this.clickSupplyButton(tokenB, tokenB)
    this.confirmMetaMask(confirm);
  }

  checkAddLiquidityTitle(tokenA,  tokenB) {
    this.titleText.should('have.text', `${tokenA}-${tokenB} LP`)
  }

  clickAddliquidityButton (network) {
    cy.wait(this.timeOut)
    this.addLiquidityButton.should('be.visible')
    this.addLiquidityButton.click({force:true, multiple:true})
    if (network == "BNB Smart Chain" || network == "BNB Smart Chain Testnet"){
      this.titleText.should('have.text', "Add Liquidity")
    }   
  }

  searchToken(token) {
    cy.contains('Select a Token').should('be.visible')
    let tokenSearch = ((token == "tBNB") ? "BNB" : token)
    this.tokenSearchInput.type(tokenSearch, {force: true}).then(() => {
      this.tokenSearchResult.should('be.visible')
      cy.wait(this.timeOut)
      this.tokenSearchResult.eq(0).find('div[color="text"]').should('contain', token)
      this.tokenSearchResult.eq(0).click({force:true})
    })
    
  }

  selectToken(pair, token){
    //pair.click({force: true})
    pair.eq(1).invoke('text').then(text => {
      if(text != token ){
        pair.eq(1).click({force: true})
        this.searchToken(token)
        pair.should('have.text', token)
      }
    })
  }

  clickSupplyButton(tokenA, tokenB) {
    cy.get('button').contains(`Enable ${tokenA}`, {timeout: 3000}).then($tokenButton => {
      if($tokenButton.is(':visible'))
        cy.get('button').contains(`Enable ${tokenA}`).click()
    })
    cy.get('button').contains(`Enable ${tokenB}`, {timeout: 3000}).then($tokenButton => {
      if($tokenButton.is(':visible'))
        cy.get('button').contains(`Enable ${tokenB}`).click()
    })
  }
}
