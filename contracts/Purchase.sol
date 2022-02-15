// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Purchase {
    struct Client {
        address addr;
        bool    sendPrice;
    }

    Client private client;

    struct Document {
        string information;
        uint  price;
    }

    address private salesman;

    Document private document;

    uint private sum;

    constructor() {
        salesman = msg.sender;
    }

    modifier isSalesman() {
        require(msg.sender == salesman, "This action can only be done by the seller");
        _;
    }

    modifier addressIsEmpty() {
        require(client.addr==address(0), "Client already exists");
        _;
    }

    modifier isPriceValid(uint price) {
        require(price > 0, "Value is not valid, send value > 0");
        _;
    }

    modifier isClient() {
        require(msg.sender != salesman, "Salesman is not a client");
        _;
    }

    modifier hasDoument() {
        require(bytes(document.information).length != 0, "Before proceeding, you must provide documents");
        _;
    }

    modifier documentPriceValid() {
        require(document.price > 0, "Make property infromation in proccessig, please wait");
        _;
    }

    modifier priceEqualValue() {
        require(document.price == msg.value, "Price is not correct");
        _;
    }

    modifier propertyNotBuyed() {
        require(!client.sendPrice, "Property buyed");
        _;
    }

    modifier propertyBuyed() {
        require(client.sendPrice, "Property buyed");
        _;
    }

    function pastPropertyDocuments(string memory doc) public isSalesman {
        document = Document(doc, 0);
    }

    function setPrice(uint price) public isSalesman isPriceValid(price) hasDoument {
        document.price = price;
    }

    function setClient() public addressIsEmpty isClient {
        client = Client(msg.sender, false);
    }

    function cacnecBuy() public isClient {
        client.addr = address(0);
        client.sendPrice = false;
    }

    function buyProperty() public payable isClient hasDoument documentPriceValid priceEqualValue propertyNotBuyed {
        payable(salesman).transfer(msg.value);
        client.sendPrice = true;
    }

    function clientProperty() public view isClient propertyBuyed returns(string memory) {
        return document.information;
    }
}