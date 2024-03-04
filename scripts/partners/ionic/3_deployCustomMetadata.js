// Deploy FlexiPunkMetadata contract
// npx hardhat run scripts/partners/ionic/3_deployCustomMetadata.js --network modeMainnet

const tldAddress = "0x2eDB84A03e5AC3C17CF0e151fC4970F13834B36E";

async function main() {
  const contractName = "IonicIdMetadata";

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract
  const contract = await ethers.getContractFactory(contractName);
  const instance = await contract.deploy();

  await instance.deployed();

  console.log("Metadata contract address:", instance.address);

  // add metadata contract address to the TLD contract
  console.log("Adding metadata contract address to the TLD contract...");
  const contractTld = await ethers.getContractFactory("FlexiPunkTLD");
  const instanceTld = await contractTld.attach(tldAddress);

  const tx1 = await instanceTld.changeMetadataAddress(instance.address);
  await tx1.wait();

  console.log("Wait a minute and then run this command to verify contracts on Etherscan:");
  console.log("npx hardhat verify --network " + network.name + " " + instance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });