// Run: npx hardhat run scripts/modechat/verify/manualTldVerification.js --network modeMainnet

const tldAddress = "0x2eDB84A03e5AC3C17CF0e151fC4970F13834B36E";

async function main() {
  console.log("Copy the line below and paste it in your terminal to verify the TLD contract on Etherscan:");
  console.log("");
  console.log("npx hardhat verify --network " + network.name + " --constructor-args scripts/modechat/verify/arguments.js " + tldAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });