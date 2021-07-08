import React from "react";
import Campaign from "../../ethereum/campaign";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Card, Button, Grid } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getSortedRoutes } from "next/dist/next-server/lib/router/utils";

const CampaignShow = ({
	campaignAddress,
	minimumContribution,
	balance,
	numRequests,
	donorsCount,
	manager,
}) => {
	const router = useRouter();
	const items = [
		{
			header: "Farmer's Address",
			meta: manager,
			description:
				"The farmer created this campaign and can create requests to withdraw this money",
			style: { overflowWrap: "break-word" },
		},
		{
			header: "Minimum Contribution",
			meta: `${minimumContribution} wei`,
			description:
				"The minimum amount to contribute to this campaign in wei to become an approver",
			style: { overflowWrap: "break-word" },
		},
		{
			header: "Camapaign Balance",
			meta: `${balance} wei = ${web3.utils.fromWei(
				balance,
				"ether"
			)} eth`,
			description: "How much money this campaign has left to spend",
			style: { overflowWrap: "break-word" },
		},
		{
			header: "Number of requests",
			meta: numRequests,
			description:
				"A request tries to withdraw money from the account. Requests must be approved by a minimum 50% of approvers",
			style: { overflowWrap: "break-word" },
		},
		{
			header: "Number of Supporters",
			meta: donorsCount,
			description:
				"The number of supporters that have already contributed to this campaign",
			style: { overflowWrap: "break-word" },
		},
	];
	return (
		<Layout>
			<h3>Campaign Show</h3>
			<Grid>
				<Grid.Row>
					<Grid.Column width={10}>
						<Card.Group items={items}></Card.Group>
					</Grid.Column>

					<Grid.Column width={6}>
						<ContributeForm campaignAddress={campaignAddress} />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<a>
							<Button
								onClick={() =>
									router.push(
										`/campaigns/${campaignAddress}/requests`
									)
								}
								primary
							>
								View Requests
							</Button>
						</a>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Layout>
	);
};

//uses server side rendering to call the campaign contracts (so good for slow devices)
CampaignShow.getInitialProps = async (props) => {
	const campaignDetails = Campaign(props.query.campaignAddress);
	const summary = await campaignDetails.methods.getSummary().call();

	return {
		campaignAddress: props.query.campaignAddress,
		minimumContribution: summary[0],
		balance: summary[1],
		numRequests: summary[2],
		donorsCount: summary[3],
		manager: summary[4],
	};
};

export default CampaignShow;
