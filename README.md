# Token and Swap

## Environmental Variables

- **ROPSTEN_URL**: RPC URL to connect to ropsten network
- **PRIVATE_KEY**: Private key of deployer
- **ETHERSCAN_API_KEY**: Etherscan API key for contract verification

## Contracts

- Network: Ropsten Network
- Token (VRK): 0x12102898F38Ab89F5e60d5FBE1084De476d673E7
- Swap: 0xADC258CFbd2Ce0E03cDf25267Bf0b4b25B22D37A

## Deployment & Manual Test

### Step 1: Compile, deploy token and verify.

```shell
npx hardhat compile
npx hardhat run ./scripts/deploy-token.ts --network ropsten
npx hardhat verify --network ropsten --contract contracts/Token.sol:Token <token_address>
```

### Step 2: Compile, deploy Swap contract and verify.

Change TokenAddress in ./scripts/deploy-swap.ts

```shell
npx hardhat compile
npx hardhat run ./scripts/deploy-swap.ts --network ropsten
npx hardhat verify --network ropsten <swap_address> <token_address>
```

### Step 3: Transfer 100% token from token creator to Swap contract

Transfer all token to Swap contract

### Step 4: Swap Ether to Token

- Swap ETH to Token using contract function

### Step 4: Approve Swap Contract in Token and Swap Token to Ether

- Approve Swap Contract in Token
- Swap Token to ETH using contract function

## Automated Test

```shell
npx hardhat test
```
