import React, { useState } from "react";
import { Form, Button, Message, Icon, Input } from "semantic-ui-react";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import web3 from "../../../../ethereum/web3";
import Campaign from "../../../../ethereum/campaign";

const initialTransactionState = {
  loading: "",
  error: "",
  success: "",
};

const RequestNew = ({ campaignAddress }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: "",
    value: "",
    recipient: "",
  });
  const { description, value, recipient } = formData;
  const [transactionState, setTransactionState] = useState(
    initialTransactionState
  );
  const { loading, error, success } = transactionState;

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("submitting", campaignAddress);
    const campaign = Campaign(campaignAddress);
    console.log(campaign);
    setTransactionState({
      ...initialTransactionState,
      loading: "Create request transaction is processing....",
    });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
        })
        .then((res) => {
          console.log(res);
          const etherscanLink = `https://rinkeby.etherscan.io/tx/${res.transactionHash}`;
          setTransactionState({
            ...initialTransactionState,
            success: (
              <a href={etherscanLink} target="_blank">
                View the transaction on Etherscan
              </a>
            ),
          });
          router.push(`/campaigns/${campaignAddress}/requests`); //this will refresh the campaign stats on the page
        })
        .catch((err) => {
          console.log(err);
          setTransactionState({
            ...initialTransactionState,
            error: err.message,
          });
        });
    } catch (err) {
      console.log("some error", err);
      setTransactionState({
        ...initialTransactionState,
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
            <Message.Header>Request Created Successfully!</Message.Header>
          )}
          {loading ? loading : error ? error : success}
        </Message.Content>
      </Message>
    );
  };

  console.log(campaignAddress);
  return (
    <Layout>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            label="ether"
            labelPosition="right"
            type="number" // enforce number only content
            step="any" //allow decimals
            min="0" //enforce positive numbers only
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(e) =>
              setFormData({ ...formData, recipient: e.target.value })
            }
          />
        </Form.Field>
        <Button disabled={Boolean(loading)}>Create Request</Button>
        <Button
          onClick={() => router.push(`/campaigns/${campaignAddress}/requests`)}
          secondary
        >
          Nahi karna re BABA Request
        </Button>
      </Form>
      {Boolean(loading || error || success) && renderMessage()}
    </Layout>
  );
};

RequestNew.getInitialProps = async (props) => {
  console.log(props);
  return { campaignAddress: props.query.campaignAddress };
};

export default RequestNew;
