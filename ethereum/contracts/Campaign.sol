// SPDX-License-Identifier: MIT 
pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
         address newCampaign = address(new Campaign(minimum,msg.sender));
         deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
    
}

contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        mapping(address => bool) approvers;
        uint approvalCount;
    }
    
    uint numRequests;
    mapping(uint => Request) public requests;
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public donors;
    uint public donorsCount;
    
    modifier restricted() {
        
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint minimum,address creator){
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require (msg.value>minimumContribution);
        donors[msg.sender]= true;
        donorsCount++;
    }
    
    function createRequest (string memory description,
        uint value,
        address payable recipient) 
        public restricted 
    {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
            
    }
    function approveRequest(uint index) public {
        
        Request storage request = requests[index];
        require(donors[msg.sender]); //should be a donor
        require(!request.approvers[msg.sender]);
        
        request.approvers[msg.sender] = true;
        request.approvalCount ++;
        
        /*
        bool isApprover = false;
        // make sure that the person calling this function 
        // has donated
        for(uint i = 0;i<donors.length;i++){
            if(donors[i] == msg.sender){
                isApprover = true;
            }
        }
        require(isApprover);
        
        // make sure that the person calling this
        // hasn't donated before
        for(uint i =0;i<request.donors.length;i++){
            requre(request.donors[i] != msg.sender);
        }
        assume that the first for loop cost 10K gas,and the other 
       for loop cost 5K, in total we spent 15K for one person.
       So for 10K contributor we have to spend 15K* 10 K = 150 M gas
       ITNA PAISA KAHA se laayenge re BABA....
        */
    }
    
    function finalizeRequest(uint index) public restricted {
        
        Request storage r = requests[index];
        
        require(!r.complete);
        require(r.approvalCount > donorsCount/2);
        
        r.recipient.transfer(r.value);
        r.complete = true;
        
        
    }
    function getSummary() public view returns(
        uint,
        uint,
        uint,
        uint,
        address)
    {
        return(
            minimumContribution,
            address(this).balance,
            numRequests,
            donorsCount,
            manager
            );
    }
    function getRequestsCount() public view returns(uint) {
        return numRequests;

    }
}