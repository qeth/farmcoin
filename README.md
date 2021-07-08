
#
# FarmCoin

Proof of concept of a decentralized financial 
system built for farmers to raise, borrow, and 
spend money as ETH cryptocurrency by creating a 
support campaign.



  ## Installation

[First you need to setup your Metamask account first](https://docs.matic.network/docs/develop/metamask/hello/).

[Obtain some ETH on the rinkeby test network](https://faucet.rinkeby.io/)

Clone the repository 

```bash
  git clone https://github.com/qeth/farmcoin.git
```

Install all the depdencies of the project

```bash
  cd farmcoin
  npm install --save
```
Follow through files of the project. You will need
 to enter the Metamask seed phrase and the infura
  project id in the web3.js and deploy.js file.
## Deployment

To deploy the smart contract to the ethereum
network

```bash
  cd ethereum
  node deploy.js
```
Note the address where the contract is deployed
and add it to the factory.js file. 

To deploy the web instance,run from the root directory

```bash
  npm run dev
```

  
## License

[MIT](https://choosealicense.com/licenses/mit/)
## Acknowledgements

I learned the fundamentals of writing smart contracts
, deploying them to the ethereum network, and the
 Solidity language from the following course.
 
 - [Stephen Grider's Course](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/)
 
 This project is inspired by one of the project of the course
 

## Further Iterations

Extend the smart contract with more functionalities
and security by implementing  more complex financial
and economic protocols.

Enhancing the web application with a focus on a more 
intuitive UI.

Deploying the contract to Ethereum Mainnet for serving
in the real world.

