const { expect } = require("chai");
const { utils } = require("ethers");
const { ethers } = require("hardhat");

let Contract;
let hardhatContract;
let owner;
let address1;
let address2;

beforeEach(async function () {
  Contract = await ethers.getContractFactory("Purchase");
  [owner, address1, address2] = await ethers.getSigners();

  hardhatContract = await Contract.deploy();
});

describe("Purchase Test", function () {
  it("past document", async () => {
    await hardhatContract
      .connect(owner)
      .pastPropertyDocuments("private property information")
    ;

    await expect(
      hardhatContract
        .connect(address1)
        .pastPropertyDocuments("failed private info")
    ).to.be.revertedWith("This action can only be done by the seller");
  });

  it("document price", async () => {
    await hardhatContract
      .connect(owner)
      .pastPropertyDocuments("private property information")
    ;

    await hardhatContract
      .connect(owner)
      .setPrice(utils.parseEther("20"))
    ;
  });

  it("document price fail", async () => {
    await expect(
      hardhatContract
        .connect(owner)
        .setPrice(utils.parseEther("20"))
    ).to.be.revertedWith("Before proceeding, you must provide documents");

    await hardhatContract
      .connect(owner)
      .pastPropertyDocuments("private property information")
    ;

    await expect( 
      hardhatContract
        .connect(owner)
        .setPrice(utils.parseEther("0"))
    ).to.be.revertedWith("Value is not valid, send value > 0");
  });

  it("client", async () => {
    await hardhatContract
      .connect(address1)
      .setClient()
    ;

    await expect( 
      hardhatContract
        .connect(address2)
        .setClient()
    ).to.be.revertedWith("Client already exists");

    await hardhatContract
      .connect(address1)
      .cacnecBuy()
    ;
    
    await expect(
      hardhatContract
        .connect(owner)
        .setClient()
    ).to.be.revertedWith("Salesman is not a client");
  });

  it("buy document", async () => {
    await hardhatContract
      .connect(owner)
      .pastPropertyDocuments("private property information")
    ;

    await hardhatContract
      .connect(owner)
      .setPrice(utils.parseEther("20"))
    ;

    await hardhatContract
      .connect(address1)
      .setClient()
    ;

    await hardhatContract
      .connect(address1)
      .buyProperty({value: utils.parseEther("20")})
    ;

    const prop = await hardhatContract
      .connect(address1)
      .clientProperty()
    ;

    expect(prop).to.equal("private property information");
  });
});
