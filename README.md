## Run project
```bash
yarn install
yarn dev
```

## Run tests
```bash
yarn test
```

## Github action workflows
### Deployed to Vercel ([link](https://eth-dapp-rfo2uhubq-kuzkovandrey.vercel.app/)).
- [Deploy to Vercel](https://github.com/kuzkovandrey/ether-dapp/blob/main/.github/workflows/deploy.yml)
- [Test delelop branch](https://github.com/kuzkovandrey/ether-dapp/blob/main/.github/workflows/test.yml)

## Test files
### Atoms components
- [GasEstimation component](https://github.com/kuzkovandrey/ether-dapp/tree/main/components/atoms/GasEstimation)
- [Pagination component](https://github.com/kuzkovandrey/ether-dapp/tree/main/components/atoms/Pagination)

### Molecules components
- [NetworkInfo component](https://github.com/kuzkovandrey/ether-dapp/tree/main/components/molecules/NetworkInfo)
- [Table component](https://github.com/kuzkovandrey/ether-dapp/tree/main/components/molecules/Table)

### Components with redux store
- [GasTracker component](https://github.com/kuzkovandrey/ether-dapp/tree/main/components/organisms/GasTracker)

### Utils
- [computeAverage](https://github.com/kuzkovandrey/ether-dapp/blob/main/helpers/gasPriorityFee/getGasPriorityFee.ts#L64), [test file](https://github.com/kuzkovandrey/ether-dapp/blob/main/helpers/gasPriorityFee/getGasPriorityFee.test.ts#L9)

### Helpers
- [getGasPriorityFee](https://github.com/kuzkovandrey/ether-dapp/tree/main/helpers/gasPriorityFee)
