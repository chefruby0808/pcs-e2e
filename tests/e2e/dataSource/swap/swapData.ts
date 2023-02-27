module.exports ={
  'mainnet': {
    // BNB SmartChain Network
    'swap default - from BNB to CAKE': {networkName: "BNB Smart Chain", swapIn: '0.001', swapOut: '', fromToken: '', toToken: ''},
    'swap from CAKE value to BNB ': {networkName: "BNB Smart Chain", swapIn: '0.001', swapOut: '', fromToken: 'CAKE', toToken: 'BNB'},
    'swap default - from BNB to CAKE - enter output value': {networkName:"BNB Smart Chain", swapIn: '', swapOut: '0.001', fromToken: '', toToken: ''},
    'swap from BNB to BUSD': {networkName: "BNB Smart Chain", swapIn: '', swapOut: '0.0051', fromToken: '', toToken: 'BUSD'},
    'swap from BUSD to CAKE': {networkName: "BNB Smart Chain", swapIn: '', swapOut: '0.0001', fromToken: 'BUSD', toToken: 'CAKE'},
    // Ethereum
    'swap default - from ETH to USDC': {networkName: "Ethereum", swapIn: '0.0001', swapOut: '', fromToken: 'ETH', toToken: 'USDC'},
    'swap from USDC value to ETH ': {networkName: "Ethereum", swapIn: '0.0001', swapOut: '', fromToken: 'ETH', toToken: 'USDC'},
    'swap default - from ETH to USDC - enter output value': {networkName: "Ethereum", swapIn: '', swapOut: '0.00001', fromToken: 'ETH', toToken: 'USDC'},
    'swap from ETH to USDT': {networkName: "Ethereum", swapIn: '', swapOut: '0.0051', fromToken: 'ETH', toToken: 'USDC'},
    'swap from USDT to ETH': {networkName: "Ethereum", swapIn: '', swapOut: '0.00001', fromToken: 'ETH', toToken: 'USDC'}
  
  },

  'testnet': {
    // Goerli
    'switch to Goerli ETH - USDC': {networkName: "Goerli", swapIn: '0.0001', swapOut: '', fromToken: 'GOR', toToken: 'tUSDC'},
    'switch to Goerli USDC - ETH': {networkName: "Goerli", swapIn: '', swapOut: '0.00009', fromToken: 'tUSDC', toToken: 'GOR'},
    'switch to Goerli CELR - ETH': {networkName: "Goerli", swapIn: '0.0001', swapOut: '', fromToken: '0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f', toToken: 'tUSDC'},
    'switch to Goerli wBTC - CERL': {networkName: "Goerli", swapIn: '0.0001', swapOut: '', fromToken: '0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05', toToken: '0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f'},
    'switch to Goerli CERL - WBTC': {networkName: "Goerli", swapIn: '', swapOut: '0.0009', fromToken: '0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05', toToken: '0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f'},

    // BNB SmartChain testnet
    'swap from CAKE value to tBNB ': {networkName: "Binance Smart Chain Testnet", swapIn: '1', swapOut: '', fromToken: 'CAKE', toToken: 'BUSD'},
    'swap default - from tBNB to CAKE - enter output value': {networkName: "Binance Smart Chain Testnet", swapIn: '', swapOut: '0.01', fromToken: '', toToken: ''},
    'swap from tBNB to BUSD': {networkName: "Binance Smart Chain Testnet", swapIn: '', swapOut: '0.000000051', fromToken: '', toToken: 'BUSD'},
    'swap from BUSD to CAKE': {networkName: "Binance Smart Chain Testnet", swapIn: '', swapOut: '1111111111', fromToken: 'BUSD', toToken: 'CAKE'},

    }  
}
