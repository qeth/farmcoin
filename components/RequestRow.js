import React, { Component } from "react";
import {Table,Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
class RequestRow() {
render() {
	const {Row,Cell} = Table;
	const {id,request,donorsCount} = this.props;
	return (
		<Row>
		<Cell>{request.id}</Cell>
		<Cell>{request.value}</Cell>
		<Cell>{web3.utils.fromWei({request.value,'ether')}</Cell>
		<Cell>{request.recipient}</Cell>
		<Cell>{request.approvalCount}</Cell>
		<Cell>{request.approvalCoun}/{request.donorsCount}</Cell>
		<Cell>
			<Button color = 'green' basic onClick = {this.onApprove}>
			Approve
			</Button>
		</Cell>
		</Row>
		);
};
}
export default RequestRow;