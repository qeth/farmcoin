const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider({
	mnemonic: {
		phrase: "YOUR_SEED_PHRASE",
	},
	providerOrUrl: "https://rinkeby.infura.io/v3/YOUR_PROJECT_ID",
});

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log("Deploying contract from account", accounts[0]);

	const result = await new web3.eth.Contract(compiledFactory.abi)
		.deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
		.send({
			gas: "5000000",
			from: accounts[0],
			gasPrice: web3.utils.toWei("2", "gwei"),
		});
	console.log("Contract deployed to", result.options.address);
};

deploy();
