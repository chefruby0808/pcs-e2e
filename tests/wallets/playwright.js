const fetch = require('node-fetch')
const { chromium } = require('@playwright/test')
const sleep = require('util').promisify(setTimeout)

let browser;
let extensionId;
let mainWindow;
let walletWindow;
let walletNotificationWindow;
let activeTabName;
let context; 

let retries = 0;

module.exports = {
  browser: () => {
    return browser
  },
  mainWindow: () => {
    return mainWindow
  },
  walletWindow: () => {
    return walletWindow
  },
  walletNotificationWindow: () => {
    return walletNotificationWindow
  },
  activeTabName: () => {
    return activeTabName
  },
  extensionId: () => {
    return extensionId
  },
  context: () => {
    return extensionId
  },
  init: async () => {
    const debuggerDetails = await fetch('http://127.0.0.1:9222/json/version') //DevSkim: ignore DS137138
    const debuggerDetailsConfig = await debuggerDetails.json()
    const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl
    if (process.env.SLOW_MODE) {
      if (!isNaN(process.env.SLOW_MODE)) {
        browser = await chromium.connectOverCDP(webSocketDebuggerUrl, {
          slowMo: Number(process.env.SLOW_MODE),
        });
      } else {
        browser = await chromium.connectOverCDP(webSocketDebuggerUrl, {
          slowMo: 50,
        });
      }
    } else {
      browser = await chromium.connectOverCDP(webSocketDebuggerUrl);
    }
    return browser.isConnected();
  },

  clear: async () => {
    browser = null;
    return true;
  },

  setExtensionId: async() => {
    context = await browser.contexts()[0]
    let [background] = await context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent("serviceworker");
   extensionId = background.url().split("/")[2];
    return true
  },

  openExtensionNewTab: async() => {
    const context = await browser.contexts()[0]
    let [background] = await context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent("serviceworker");
   extensionId = background.url().split("/")[2];
    const [newPage] = await Promise.all([
      //browser.contexts()[0].waitForEvent('page'),
     await context.newPage()
  ])
  await newPage.waitForLoadState();
  await newPage.goto(`chrome-extension://${extensionId}/index.html`)
  await newPage.waitForLoadState();
  },

  reloadExtension: async() => {
    await walletWindow.goto(`chrome-extension://${extensionId}/index.html`)
    await walletWindow.waitForLoadState()
    await walletWindow.waitForTimeout(10000)
  },

  assignWindows: async () => {
    let pages = await browser.contexts()[0].pages();
    for (const page of pages) {
      if (page.url().includes('runner')) {
        mainWindow = page;
      } else if (page.url().includes('extension')) {
        walletWindow = page;
      } else if (page.url().includes('prompt')) {
        walletNotificationWindow = page;
      }
    }
    return true;
  },
  assignActiveTabName: async tabName => {
    activeTabName = tabName;
    return true;
  },
  clearWindows: async () => {
    mainWindow = null;
    metamaskWindow = null;
    metamaskNotificationWindow = null;
    return true;
  },
  isCypressWindowActive: async () => {
    if (activeTabName === 'cypress') {
      return true;
    } else {
      return false;
    }
  },

  switchToCypressWindow: async () => {
    await mainWindow.bringToFront();
    await module.exports.assignActiveTabName('cypress');
    return true;
  },

  switchToMetamaskWindow: async () => {
    await walletWindow.bringToFront();
    await module.exports.assignActiveTabName('metamask');
    return true;
  },

  waitFor: async (selector, page = petraWindow) => {
    await page.waitForSelector(selector, { strict: false });
    const element = await page.locator(selector).first();
    await element.waitFor();
    await element.focus();
    if (process.env.STABLE_MODE) {
      if (!isNaN(process.env.STABLE_MODE)) {
        await page.waitForTimeout(Number(process.env.STABLE_MODE));
      } else {
        await page.waitForTimeout(300);
      }
    }
    return element;
  },

  waitAndClick: async (selector, page = walletNotificationWindow, args = {}) => {
    console.log(`wait and click ${selector}, ${page}`)
    const element = await module.exports.waitFor(selector, page);
    if (args.numberOfClicks && !args.waitForEvent) {
      await element.click({
        clickCount: args.numberOfClicks,
        force: args.force,
      });
    } else if (args.numberOfClicks && args.waitForEvent) {
      await Promise.all([
        page.waitForEvent(args.waitForEvent),
        element.click({ clickCount: args.numberOfClicks, force: args.force }),
      ]);
    } else if (args.waitForEvent) {
      if (args.waitForEvent.includes('navi')) {
        await Promise.all([
          page.waitForNavigation(),
          element.click({ force: args.force }),
        ]);
      } else {
        await Promise.all([
          page.waitForEvent(args.waitForEvent),
          element.click({ force: args.force }),
        ]);
      }
    } else {
      await element.click({ force: args.force });
    }

    await page.waitForLoadState();
    await mainWindow.waitForLoadState();
    await walletNotificationWindow.waitForLoadState();

    return element;
  },

  switchToMetaMaskNotification: async () => {
    console.log("Switch Metamask Noti: ")
    let pages = await browser.contexts()[0].pages();
    for (const page of pages) {
      if (page.url().includes('notification')) {
        await page.bringToFront();
        await page.waitForLoadState('networkidle');
        walletNotificationWindow = page;
        retries = 0;
        return page;
      }
    }
    await sleep(500);
    if (retries < 100) {
      retries++;
      return await module.exports.switchToMetaMaskNotification();
    } else if (retries >= 50) {
      retries = 0;
      throw new Error(
        '[switchToMMNotification] Max amount of retries to switch to metamask notification window has been reached. It was never found.',
      );
    }
  },

  clickByText: async (text, page = walletNotificationWindow) => {
    const element = await page.locator(`text=${text}`).last()
    if(await element.isVisible()) {
      await element.waitFor()
      await element.focus()
      await element.click()
      await page.waitForLoadState()
    }
  },

  isMetamaskNotificationWindowActive: async () => {
    if (activeTabName === 'metamask-notif') {
      return true;
    } else {
      return false;
    }
  },

  switchToMetamaskNotificationWindow: async () => {
    await walletNotificationWindow.bringToFront();
    await module.exports.assignActiveTabName('metamask-notif');
    return true;
  },
};
