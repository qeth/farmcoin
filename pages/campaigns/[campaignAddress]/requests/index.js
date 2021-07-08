// Will show the list of request to the user
import React, { Component, useState } from "react";
import { Button, Table, Message, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

const initalTransactionState = {
  loading: "",
  error: "",
  success: "",
  action: "",
};

const RequestIndex = ({
  campaignAddress,
  requests,
  numRequests,
  donorsCount,
}) => {
  const router = useRouter();
  const [transactionState, setTransactionState] = useState(
    initalTransactionState
  );
  const { Header, Row, Body, Cell, HeaderCell } = Table;
  const { loading, error, success } = transactionState;
  //const headers = ["ID", "Description"];
  //console.log(campaignAddress, requests, donorsCount, numRequests);

  // move the 2 actions into one function really with state for approve or finalise
  const onApprove = async (id) => {
    const campaign = Campaign(campaignAddress);
    setTransactionState({
      ...initalTransactionState,
      loading: "Approval is processing....",
    });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .approveRequest(parseInt(id))
        .send({
          from: accounts[0],
        })
        .then((res) => {
          console.log(res);
          const etherscanLink = `https://rinkeby.etherscan.io/tx/${res.transactionHash}`;
          setTransactionState({
            ...initalTransactionState,
            success: (
              <a href={etherscanLink} target="_blank">
                View the transaction on Etherscan
              </a>
            ),
          });
          router.replace(`/campaigns/${campaignAddress}/requests/index`);
        })
        .catch((err) => {
          console.log(err);
          setTransactionState({
            ...initalTransactionState,
            error: err.message,
          });
        });
    } catch (err) {
      console.log("some error", err);
      setTransactionState({
        ...initalTransactionState,
        error: err.message,
      });
    }
  };

  const onFinalise = async (id) => {
    const campaign = Campaign(campaignAddress);
    setTransactionState({
      ...initalTransactionState,
      loading: "Finalise request is processing....",
    });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .finalizeRequest(parseInt(id))
        .send({
          from: accounts[0],
        })
        .then((res) => {
          console.log(res);
          const etherscanLink = `https://rinkeby.etherscan.io/tx/${res.transactionHash}`;
          setTransactionState({
            ...initalTransactionState,
            success: (
              <a href={etherscanLink} target="_blank">
                View the transaction on Etherscan
              </a>
            ),
          });
          router.replace(`/campaigns/${campaignAddress}/requests/index`); //this will refresh the campaign stats on the page
        })
        .catch((err) => {
          console.log(err);
          setTransactionState({
            ...initalTransactionState,
            error: err.message,
          });
        });
    } catch (err) {
      console.log("some error", err);
      setTransactionState({
        ...initalTransactionState,
        error: err.message,
      });
    }
  };

  const renderMessage = () => {
    return (
      <Message
        icon
        negative={Boolean(error)}
        success={Boolean(success)}
        style={{ overflowWrap: "break-word" }}
      >
        <Icon
          name={
            loading ? "circle notched" : error ? "times circle" : "check circle"
          }
          loading={Boolean(loading)}
        />
        <Message.Content>
          {Boolean(success) && (
            <Message.Header>Request Successful!</Message.Header>
          )}
          {loading ? loading : error ? error : success}
        </Message.Content>
      </Message>
    );
  };

  const renderRow = (
    { approvalCount, complete, description, recipient, value },
    index
  ) => {
    return (
      <Row key={index} textAlign="center" disabled={complete}>
        <Cell>{index}</Cell>
        <Cell>{description}</Cell>
        <Cell>{web3.utils.fromWei(value, "ether")}</Cell>
        <Cell>{recipient}</Cell>
        <Cell>
          {approvalCount}/{donorsCount}
        </Cell>
        <Cell>
          {complete ? (
            "Finalised"
          ) : approvalCount >= donorsCount / 2 ? (
            "Quota met"
          ) : (
            <Button
              color="green"
              basic
              size="large"
              disabled={Boolean(loading)} // don't allow more clicks if loading
              onClick={() => onApprove(index)}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {complete ? (
            "Finalised"
          ) : (
            <Button
              color="pink"
              basic
              size="large"
              disabled={Boolean(loading)}
              onClick={() => onFinalise(index)}
            >
              Finalise
            </Button>
          )}
        </Cell>
      </Row>
    );
  };

  return (
    <Layout>
      <h3>Requests</h3>
      <Button
        onClick={() =>
          router.push(`/campaigns/${campaignAddress}/requests/new`)
        }
        color="teal"
        size="large"
        floated="right"
        style={{ marginBottom: "20px" }}
      >
        Add Request
      </Button>
      <Table>
        <Header>
          <Row textAlign="center">
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount (eth)</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalise</HeaderCell>
          </Row>
        </Header>
        <Body>
          {/*Loop through all the requests to render them*/}
          {requests ? (
            requests.map((request, index) => {
              return renderRow(request, index);
            })
          ) : (
            <Row>Something went wrong</Row>
          )}
        </Body>
      </Table>
      {Boolean(loading || error || success) && renderMessage()}
    </Layout>
  );
};

RequestIndex.getInitialProps = async (props) => {
  const { campaignAddress } = props.query;
  const campaign = Campaign(campaignAddress);
  const numRequests = await campaign.methods.getRequestsCount().call();
  const requests = await Promise.all(
    Array(parseInt(numRequests))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  console.log(requests);
  const donorsCount = await campaign.methods.donorsCount().call();
  return { campaignAddress, requests, numRequests, donorsCount };
};

export default RequestIndex;
