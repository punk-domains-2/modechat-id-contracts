// Deploy metadata contract
// npx hardhat run scripts/modechat/6_deployStatsMiddleware.js --network modeMainnet

const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";
const sfsNftTokenId = 286; // TODO: Enter SFS NFT token ID!!!
const statsAddress = "0x63f8691b048e68E1C3d6E135aDc81291A9bb1987";
const managerAddress = "0x6771F33Cfd8C6FC0A1766331f715f5d2E1d4E0e2"; // add iggy deployer as manager

async function main() {
  if (sfsNftTokenId == 0) {
    console.log("Please enter SFS NFT token ID!!!");
    return;
  }

  const contractName = "StatsMiddleware";

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract
  const contract = await ethers.getContractFactory(contractName);
  const instance = await contract.deploy(
    sfsAddress,
    sfsNftTokenId,
    statsAddress
  );

  await instance.deployed();

  // add manager address
  const tx1 = await instance.addManager(managerAddress);
  await tx1.wait();

  // create stats contract
  const stats = await ethers.getContractFactory("Stats");
  const statsInstance = await stats.attach(statsAddress);

  // set middleware contract address as setStatsWriterAddress
  await statsInstance.setStatsWriterAddress(instance.address);

  console.log("Contract address:", instance.address);

  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + instance.address + " " + sfsAddress + ' "' + sfsNftTokenId + '" ' + statsAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });