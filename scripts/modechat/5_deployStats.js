// Deploy metadata contract
// npx hardhat run scripts/modechat/5_deployStats.js --network modeMainnet

const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";
const sfsNftTokenId = 286; // TODO: Enter SFS NFT token ID!!!

async function main() {
  if (sfsNftTokenId == 0) {
    console.log("Please enter SFS NFT token ID!!!");
    return;
  }

  const contractName = "Stats";

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract
  const contract = await ethers.getContractFactory(contractName);
  const instance = await contract.deploy(
    sfsAddress,
    sfsNftTokenId
  );

  await instance.deployed();

  console.log("Contract address:", instance.address);

  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + instance.address + " " + sfsAddress + ' "' + sfsNftTokenId + '"');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });