import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const factoryInstance = new web3.eth.Contract(
	CampaignFactory.abi,
	"ADDRESS_OF_DEPLOYED_CONTRACT"
);
export default factoryInstance;
