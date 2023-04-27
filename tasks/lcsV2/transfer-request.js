const { task } = require("hardhat/config");

task("transfer-request", "Initiate a transfer request")
  .addParam("contractAddress", "lcs contract address")
  .addParam("originDomain", "origin domain")
  .addParam("destinationDomain", "destination domain")
  .addParam("amount", "Amount of the transfer request")
  .addParam("encryptedOrigin", "encrypted origin")
  .addParam("encryptedDestination", "encrypted destination")
  .addParam("expiration", "expiration time of the transfer request")
  .addParam("externalRef", "external reference")
  .setAction(async (taskArgs, hre) => {
    let [sender] = await hre.ethers.getSigners();

    const lcs = (
      await hre.ethers.getContractFactory("LocalCoinSettlementV2")
    ).attach(taskArgs.contractAddress);

    const amount = hre.ethers.utils.parseEther(taskArgs.amount);

    // get transfer hash
    const transferHash = await hre.run("get-transfer-hash", {
      contractAddress: taskArgs.contractAddress,
      sender: sender.address,
      originDomain: taskArgs.originDomain,
      destinationDomain: taskArgs.destinationDomain,
      amount: taskArgs.amount,
      encryptedOrigin: taskArgs.encryptedOrigin,
      encryptedDestination: taskArgs.encryptedDestination,
      expiration: taskArgs.expiration,
    });

    console.log("Transfer request...");
    const transferRequestTx = await lcs
      .connect(sender)
      .transferRequest(
        taskArgs.originDomain,
        taskArgs.destinationDomain,
        amount,
        taskArgs.encryptedOrigin,
        taskArgs.encryptedDestination,
        taskArgs.expiration,
        taskArgs.externalRef
      );
    await transferRequestTx.wait(1);

    console.log(`Transfer request submitted!`);
  });

module.exports = {};
