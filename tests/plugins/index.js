
const path = require('path')
const extension_path = path.join(process.cwd(), '/tests/extensions/metamask/v10.21.0')
const playwright = require('../wallets/playwright')
const metamask = require('../wallets/metamask')
const helpers = require('../wallets/helpers')

/**
 * @type {Cypress.PluginConfig}
 */

 module.exports = (on, config) => {

  on('before:browser:launch', async (browser = {}, arguments_) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      console.log('TRUE'); // required by cypress ¯\_(ツ)_/¯
      arguments_.args.push('--window-size=1920,1080');
      return arguments_;
    }
    if (browser.name === 'chrome') {
      arguments_.args.push(
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      );
      const metamaskPath = await helpers.prepareMetamask(
        process.env.METAMASK_VERSION || '10.21.0',
      );
      arguments_.extensions.push(metamaskPath);
    }
    return arguments_;

  })
  on('task', {
    error(message) {
      console.error('\u001B[31m', 'ERROR:', message, '\u001B[0m');
      return true;
    },
    warn(message) {
      console.warn('\u001B[33m', 'WARNING:', message, '\u001B[0m');
      return true;
    },

    // playwright commands
    initPlaywright: async () => {
      const connected = await playwright.init();
      return connected;
    },

    clearPlaywright: async () => {
      const cleared = await playwright.clear();
      return cleared;
    },

    setUpMetamaskWallet: async () => {
      const setUpWallet = await metamask.setUpMetamaskWallet()
      return setUpWallet
    }, 

    approveMetamaskWallet: async () => {
      const approveWallet = await metamask.approveMetamaskWallet()
      return approveWallet
    },

    confirmTransaction: async () => {
      const confirmTransaction = await metamask.confirmTransaction()
      return confirmTransaction
    },

    rejectTransaction: async () => {
      const rejectTransaction = await metamask.rejectTransaction()
      return rejectTransaction
    },

    addSwitchNetWork: async() => {
      const addSwitchNetWork = await metamask.addSwitchNetWork()
      return addSwitchNetWork
    }
  })
  return config;
 }
 