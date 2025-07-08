const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Presale", function () {
  let mockUSDT, myToken, presale;
  let owner, buyer1, buyer2;
  let presaleStart, presaleEnd;

  beforeEach(async function () {
    [owner, buyer1, buyer2] = await ethers.getSigners();

    // Deploy MockUSDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    mockUSDT = await MockUSDT.deploy();

    // Deploy MyToken
    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy("MyToken", "MTK", 1000000);

    // Set presale period
    const currentTime = Math.floor(Date.now() / 1000);
    presaleStart = currentTime + 60;
    presaleEnd = currentTime + 86400 * 30;

    // Deploy Presale
    const Presale = await ethers.getContractFactory("Presale");
    presale = await Presale.deploy(
      await myToken.getAddress(),
      await mockUSDT.getAddress(),
      ethers.parseUnits("0.1", 6), // 0.1 USDT per token
      ethers.parseUnits("100", 18), // Min purchase: 100 tokens
      ethers.parseUnits("10000", 18), // Max purchase: 10,000 tokens
      ethers.parseUnits("500000", 18), // 500K tokens for sale
      presaleStart,
      presaleEnd
    );

    // Transfer tokens to presale contract
    await myToken.transfer(await presale.getAddress(), ethers.parseUnits("500000", 18));

    // Mint USDT to buyers
    await mockUSDT.mint(buyer1.address, ethers.parseUnits("1000", 6));
    await mockUSDT.mint(buyer2.address, ethers.parseUnits("1000", 6));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await presale.owner()).to.equal(owner.address);
    });

    it("Should set the correct token addresses", async function () {
      expect(await presale.token()).to.equal(await myToken.getAddress());
      expect(await presale.paymentToken()).to.equal(await mockUSDT.getAddress());
    });

    it("Should set the correct presale parameters", async function () {
      expect(await presale.tokenPrice()).to.equal(ethers.parseUnits("0.1", 6));
      expect(await presale.minPurchase()).to.equal(ethers.parseUnits("100", 18));
      expect(await presale.maxPurchase()).to.equal(ethers.parseUnits("10000", 18));
      expect(await presale.totalTokensForSale()).to.equal(ethers.parseUnits("500000", 18));
    });
  });

  describe("Token Purchase", function () {
    beforeEach(async function () {
      // Fast forward time to presale start
      await ethers.provider.send("evm_setNextBlockTimestamp", [presaleStart + 1]);
      await ethers.provider.send("evm_mine");
    });

    it("Should allow token purchase", async function () {
      const purchaseAmount = ethers.parseUnits("1000", 18);
      const expectedCost = ethers.parseUnits("100", 6); // 1000 * 0.1

      await mockUSDT.connect(buyer1).approve(await presale.getAddress(), expectedCost);
      await presale.connect(buyer1).buyTokens(purchaseAmount);

      expect(await myToken.balanceOf(buyer1.address)).to.equal(purchaseAmount);
      expect(await presale.tokensSold()).to.equal(purchaseAmount);
      expect(await presale.totalRaised()).to.equal(expectedCost);
    });

    it("Should fail if amount is below minimum", async function () {
      const purchaseAmount = ethers.parseUnits("50", 18);
      const cost = ethers.parseUnits("5", 6);

      await mockUSDT.connect(buyer1).approve(await presale.getAddress(), cost);
      await expect(
        presale.connect(buyer1).buyTokens(purchaseAmount)
      ).to.be.revertedWith("Amount below minimum purchase");
    });

    it("Should fail if amount exceeds maximum", async function () {
      const purchaseAmount = ethers.parseUnits("15000", 18);
      const cost = ethers.parseUnits("1500", 6);

      await mockUSDT.connect(buyer1).approve(await presale.getAddress(), cost);
      await expect(
        presale.connect(buyer1).buyTokens(purchaseAmount)
      ).to.be.revertedWith("Amount exceeds maximum purchase");
    });

    it("Should fail if presale has not started", async function () {
      // Reset time to before presale start
      await ethers.provider.send("evm_setNextBlockTimestamp", [presaleStart - 1]);
      await ethers.provider.send("evm_mine");

      const purchaseAmount = ethers.parseUnits("1000", 18);
      const cost = ethers.parseUnits("100", 6);

      await mockUSDT.connect(buyer1).approve(await presale.getAddress(), cost);
      await expect(
        presale.connect(buyer1).buyTokens(purchaseAmount)
      ).to.be.revertedWith("Presale has not started");
    });
  });

  describe("Whitelist", function () {
    beforeEach(async function () {
      await presale.setWhitelistEnabled(true);
      await ethers.provider.send("evm_setNextBlockTimestamp", [presaleStart + 1]);
      await ethers.provider.send("evm_mine");
    });

    it("Should allow whitelisted users to purchase", async function () {
      await presale.setWhitelist([buyer1.address], [true]);
      
      const purchaseAmount = ethers.parseUnits("1000", 18);
      const cost = ethers.parseUnits("100", 6);

      await mockUSDT.connect(buyer1).approve(await presale.getAddress(), cost);
      await presale.connect(buyer1).buyTokens(purchaseAmount);

      expect(await myToken.balanceOf(buyer1.address)).to.equal(purchaseAmount);
    });

    it("Should prevent non-whitelisted users from purchasing", async function () {
      const purchaseAmount = ethers.parseUnits("1000", 18);
      const cost = ethers.parseUnits("100", 6);

      await mockUSDT.connect(buyer1).approve(await presale.getAddress(), cost);
      await expect(
        presale.connect(buyer1).buyTokens(purchaseAmount)
      ).to.be.revertedWith("Address not whitelisted");
    });
  });

  describe("Presale Finalization", function () {
    it("Should allow owner to finalize presale", async function () {
      await ethers.provider.send("evm_setNextBlockTimestamp", [presaleEnd + 1]);
      await ethers.provider.send("evm_mine");

      await presale.finalizePresale();
      expect(await presale.presaleFinalized()).to.be.true;
    });

    it("Should prevent non-owner from finalizing", async function () {
      await ethers.provider.send("evm_setNextBlockTimestamp", [presaleEnd + 1]);
      await ethers.provider.send("evm_mine");

      await expect(
        presale.connect(buyer1).finalizePresale()
      ).to.be.revertedWithCustomError(presale, "OwnableUnauthorizedAccount");
    });
  });
}); 