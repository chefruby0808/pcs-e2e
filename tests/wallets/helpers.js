const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const download = require('download');
const packageJson = require('../../package.json');

module.exports = {  
  createDirIfNotExist: async path => {
    try {
      console.log(`Checking if directory exists on path: ${path}`);
      await fs.access(path);
      return true;
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.log(`Creating directory as it doesn't exist..`);
        await fs.mkdir(path);
        return true;
      } else {
        throw new Error(
          `[createDirIfNotExist] Unhandled error from fs.access() with following error:\n${e}`,
        );
      }
    }
  },

  checkDirOrFileExist: async path => {
    try {
      console.log(`Checking if directory exists on path: ${path}`);
      await fs.access(path);
      return true;
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.log(`Directory or file doesn't exist`);
        return false;
      } else {
        throw new Error(
          `[checkDirOrFileExist] Unhandled error from fs.access() with following error:\n${e}`,
        );
      }
    }
  },

  getMetamaskReleases: async version => {
    console.log(`Trying to find metamask version ${version} in GitHub releases..`);
    let filename;
    let downloadUrl;
    let tagName;

    try {
      const response = await axios.get(
        'https://api.github.com/repos/metamask/metamask-extension/releases',
      );
      if (version === 'latest' || !version) {
        filename = response.data[0].assets[0].name;
        downloadUrl = response.data[0].assets[0].browser_download_url;
        tagName = response.data[0].tag_name;
        console.log(
          `Metamask version found! Filename: ${filename}; Download url: ${downloadUrl}; Tag name: ${tagName}`,
        );
      } else if (version) {
        filename = `metamask-chrome-${version}.zip`;
        downloadUrl = `https://github.com/MetaMask/metamask-extension/releases/download/v${version}/metamask-chrome-${version}.zip`;
        tagName = `metamask-chrome-${version}`;
        console.log(
          `Metamask version found! Filename: ${filename}; Download url: ${downloadUrl}; Tag name: ${tagName}`,
        );
      }
      return {
        filename,
        downloadUrl,
        tagName,
      };
    } catch (e) {
      throw new Error(
        `[getMetamaskReleases] Unable to fetch metamask releases from: ${downloadUrl} with following error:\n${e}`,
      );
    }
  },

  download: async (url, destination) => {
    try {
      console.log(
        `Trying to download and extract file from: ${url} to following path: ${destination}`,
      );
      await download(url, destination, { extract: true });
    } catch (e) {
      throw new Error(
        `[download] Unable to download metamask release from: ${url} to: ${destination} with following error:\n${e}`,
      );
    }
  },
  
  prepareMetamask: async version => {
    const release = await module.exports.getMetamaskReleases(version);
    const downloadsDirectory = path.resolve(__dirname, 'extensions');
    await module.exports.createDirIfNotExist(downloadsDirectory);
    const metamaskDirectory = path.join(downloadsDirectory, release.tagName);
    const metamaskDirectoryExists = await module.exports.checkDirOrFileExist(
      metamaskDirectory,
    );
    const metamaskManifestFilePath = path.join(
      downloadsDirectory,
      release.tagName,
      'manifest.json',
    );
    const metamaskManifestFileExists = await module.exports.checkDirOrFileExist(
      metamaskManifestFilePath,
    );
    if (!metamaskDirectoryExists && !metamaskManifestFileExists) {
      await module.exports.download(release.downloadUrl, metamaskDirectory);
    } else {
      console.log('Metamask is already downloaded');
    }
    return metamaskDirectory;
  },

  getPath: () => {
    if (process.env.LOCAL_TEST) {
      return '.';
    } else {
      return path.dirname(require.resolve(packageJson.name));
    }
  },
}
