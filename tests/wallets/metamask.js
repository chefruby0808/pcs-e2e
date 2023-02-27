const cypress = require('cypress');
const playwright = require('./playwright');
const YAML = require('yamljs')
const file = require('fs-extra')
const path = require('path');
const sleep = require('util').promisify(setTimeout)
const metamaskPath = path.join(process.cwd(), 'tests/wallets/pages/metamaskPage.yml')
const MetamaskPage = YAML.parse(file.readFileSync(`${metamaskPath}`,'utf-8'))


module.exports = {
  setUpMetamaskWallet: async ()  => {
    await playwright.init()
    if (process.env.PRIVATE_KEY) {
      var privateKey = process.env.PRIVATE_KEY;
    }
    await playwright.assignWindows()
    await playwright.assignActiveTabName('metamask')
    await playwright.walletWindow().reload()
    await playwright.walletWindow().waitForTimeout(3000)
    await playwright.walletWindow().locator(MetamaskPage.get_started).click()
    await playwright.walletWindow().locator(MetamaskPage.agree_button).click()

    await playwright.walletWindow().locator(MetamaskPage.create_wallet).click()
    await playwright.walletWindow().locator(MetamaskPage.new_password).fill('Abcd@1234')
    await playwright.walletWindow().locator(MetamaskPage.confirm_password).fill('Abcd@1234')
    await playwright.walletWindow().locator(MetamaskPage.checkbox_confirm).click()
    await playwright.walletWindow().locator(MetamaskPage.button_confirm).click()
    await playwright.walletWindow().locator(MetamaskPage.button_confirm).click()

    await playwright.walletWindow().locator(MetamaskPage.remind_later).click()
 
    await playwright.walletWindow().locator(MetamaskPage.account_menu_button).click()
    await playwright.walletWindow().locator(`text="Import account"`).click()

    await playwright.walletWindow().locator(MetamaskPage.input_private_key).fill(privateKey)
    await playwright.walletWindow().locator(`text="Import"`).click()
    await playwright.walletWindow().waitForLoadState()
    await playwright.walletWindow().waitForTimeout(3000)

    await playwright.switchToCypressWindow()
    return true
    },

    approveMetamaskWallet: async () => {
      const notificationPage = await playwright.switchToMetaMaskNotification()
      await playwright.clickByText("Next")
      await playwright.clickByText("Connect")
      await module.exports.addSwitchNetWork()
      await playwright.switchToCypressWindow()   
      return true
    },

    allowMetamaskAccept: async () => {
      const notificationPage = await playwright.switchToMetaMaskNotification()
      await playwright.waitAndClick(MetamaskPage.approve_button, notificationPage)
      await playwright.waitAndClick(MetamaskPage.approve_button, notificationPage)
      return true
    },

    confirmTransaction: async () => {
      const notificationPage = await playwright.switchToMetaMaskNotification()
      await playwright.waitAndClick(
        MetamaskPage.confirm_button,
        notificationPage,
        { waitForEvent: 'close' },
      );
      return true
    },

    rejectTransaction: async () => {
      const notificationPage = await playwright.switchToMetaMaskNotification()
      await playwright.waitAndClick(
        MetamaskPage.reject_button,
        notificationPage
      );
      return true
    },

    addSwitchNetWork: async () => {
      await sleep(1000)
      const notificationPage = await playwright.switchToMetaMaskNotification()
      playwright.clickByText("Got it")
      // if(await notificationPage.locator(`text="Got it"`).isVisible())
      //   await playwright.clickByText("Got it")
      await playwright.switchToMetamaskNotificationWindow()
      let isMetamaskActive = await playwright.isMetamaskNotificationWindowActive()
      if(isMetamaskActive == true){
        await playwright.waitAndClick(MetamaskPage.approve_button, notificationPage)
        if(await notificationPage.locator(MetamaskPage.approve_button).isVisible())
          await playwright.waitAndClick(MetamaskPage.approve_button, notificationPage)
      }   
      return true
    },
}
