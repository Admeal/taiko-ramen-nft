import { expect, use } from "chai";
import { ethers } from "hardhat";
import chaiAsPromised from "chai-as-promised";

use(chaiAsPromised);

const ONE_ETHER = ethers.utils.parseUnits("1", "ether");
const PRICE = ONE_ETHER.div(1000);
const URL = "https://example.com/api/1.json";
const MAX_SUPPLY = 10000;

describe("TaikoRamen Token", function () {
  let TaikoRamen:any;
  let taikoRamen:any;
  
  let owner:any;
  let addr1:any;
  let addr2:any;
  let addr3:any;
  let addrs:any;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    TaikoRamen = await ethers.getContractFactory("TaikoRamen");
    taikoRamen = await TaikoRamen.deploy(MAX_SUPPLY, PRICE, URL);
  });

  it("Check initial parametrs of the token" , async () => {
    expect(
      await taikoRamen.tokenTypesAmount()
    ).to.be.equal(1);

    const tokenType = await taikoRamen.tokenTypes(0);

    expect(tokenType.pricePerCopy).to.be.equal(PRICE);
    expect(tokenType.maxSupply).to.be.equal(MAX_SUPPLY);
    expect(tokenType.currentSupply).to.be.equal(0);
    
    expect(
      await taikoRamen.owner()
    ).to.be.equal(owner.address);
  });

  it("Create new token type", async () => {
    await taikoRamen.createNewTokenType(MAX_SUPPLY / 2, PRICE.mul(3), "2");

    expect(
      await taikoRamen.tokenTypesAmount()
    ).to.be.equal(2);

    const tokenType = await taikoRamen.tokenTypes(1);

    expect(tokenType.pricePerCopy).to.be.equal(PRICE.mul(3));
    expect(tokenType.maxSupply).to.be.equal(MAX_SUPPLY / 2);
    expect(tokenType.currentSupply).to.be.equal(0);
  });

  it("Update token type", async () => {
    await taikoRamen.updateTokenType(0, MAX_SUPPLY / 2, PRICE.mul(3), "2");

    const tokenType = await taikoRamen.tokenTypes(0);
    expect(tokenType.pricePerCopy).to.be.equal(PRICE.mul(3));
    expect(tokenType.maxSupply).to.be.equal(MAX_SUPPLY / 2);
    expect(tokenType.currentSupply).to.be.equal(0);
  });

  it("Mint token", async () => {
    await taikoRamen.connect(addr1).mint(0, {value: PRICE});

    const tokenType = await taikoRamen.tokenTypes(0);
    expect(tokenType.currentSupply).to.be.equal(1);

    expect(await ethers.provider.getBalance(taikoRamen.address)).to.be.equal(PRICE);

    expect(
      await taikoRamen.balanceOf(addr1.address, 0)
    ).to.be.equal(1);
  });

  it("Mint token with wrong price", async () => {
    await expect(
      taikoRamen.connect(addr1).mint(0, {value: PRICE.div(2)})
    ).to.be.revertedWith("TaikoRamen: Insufficient payment");
  });

  it("Mint token with wrong type", async () => {
    await expect(
      taikoRamen.connect(addr1).mint(1, {value: PRICE})
    ).to.be.revertedWith("TaikoRamen: All token copies have been minted");
  });

  it("Mint token twice", async () => {
    await taikoRamen.connect(addr1).mint(0, {value: PRICE});

    await expect(
      taikoRamen.connect(addr1).mint(0, {value: PRICE})
    ).to.be.revertedWith("TaikoRamen: You cannot mint more than one copy of the same token type");
  });

  it("Mint with over price", async () => {
    await taikoRamen.connect(addr1).mint(0, {value: PRICE.mul(3)});

    const tokenType = await taikoRamen.tokenTypes(0);
    expect(tokenType.currentSupply).to.be.equal(1);

    const balanceOfToken = await ethers.provider.getBalance(taikoRamen.address);
    const balanceOfBuyer = await ethers.provider.getBalance(addr1.address);

    expect(balanceOfToken).to.be.equal(PRICE);
    expect(balanceOfBuyer).to.be.closeTo((ONE_ETHER.mul(10000).sub(PRICE.mul(1))), ONE_ETHER.div(10));
  });

  it("Mint more than max supply", async () => {
    await taikoRamen.updateTokenType(0, 1, PRICE, "2");
    await taikoRamen.connect(addr1).mint(0, {value: PRICE});
    
    await expect(taikoRamen.connect(addr2).mint(0, {value: PRICE}))
      .to.be.revertedWith("TaikoRamen: All token copies have been minted");
  });

  it("Mint without calling mint function", async () => {
    await addr1.sendTransaction({
      to: taikoRamen.address,
      value: PRICE,
      gasLimit: ethers.BigNumber.from('1000000')
    })

    const tokenType = await taikoRamen.tokenTypes(0);
    expect(tokenType.currentSupply).to.be.equal(1);
    expect(await ethers.provider.getBalance(taikoRamen.address)).to.be.equal(PRICE);

    expect(
      await taikoRamen.balanceOf(addr1.address, 0)
    ).to.be.equal(1);
  });

  it("Withdraw native tokens", async () => {
    await taikoRamen.connect(addr1).mint(0, {value: PRICE});
    const balanceOfOwnerBefore = await ethers.provider.getBalance(owner.address);
    await taikoRamen.connect(owner).withdraw();

    const balanceOfToken = await ethers.provider.getBalance(taikoRamen.address);
    const balanceOfOwnerAfter = await ethers.provider.getBalance(owner.address);

    expect(balanceOfToken).to.be.equal(0);
    expect(balanceOfOwnerAfter.sub(balanceOfOwnerBefore)).to.be.closeTo(PRICE, ONE_ETHER.div(1000));
  });
});
