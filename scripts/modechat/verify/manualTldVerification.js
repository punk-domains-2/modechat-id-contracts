// Run: npx hardhat run scripts/modechat/verify/manualTldVerification.js --network modeMainnet

const tldAddress = "0x523a7050df3DC7E96B7faAF4dDECCc244d886a90";

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