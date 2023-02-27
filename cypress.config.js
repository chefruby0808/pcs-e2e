const { defineConfig } = require("cypress");
const path = require('path');


const projPath = process.cwd();
const pluginsPath = `${projPath}/tests/plugins/index`;
const setupNodeEvents = require(`${pluginsPath}`);
const supportFile = "tests/support/index.js";


module.exports = defineConfig({
  chromeWebSecurity: true,
  taskTimeout: 60000,
  screenshotsFolder: 'tests/screenshots',
  videosFolder: 'tests/videos',
  viewportWidth: 1920,
  viewportHeight: 1080,
  retries: {
    runMode: 0,
    openMode: 0,
  },
  defaultCommandTimeout: process.env.SYNDEBUG ? 9999999 : 60000,
  pageLoadTimeout: process.env.SYNDEBUG ? 9999999 : 60000,
  requestTimeout: process.env.SYNDEBUG ? 9999999 : 60000,
  env: {
    networkType: "testnet",
    timeOut: 3000
  },
  e2e: {
    setupNodeEvents,
    baseUrl: 'https://pancakeswap.finance',
    specPattern: 'tests/e2e/specs/**/*.{js,jsx,ts,tsx}',
    supportFile: supportFile
  },
  component: {
    setupNodeEvents,
    specPattern: './**/*spec.{js,jsx,ts,tsx}',
    supportFile: supportFile,
  },

  
});
