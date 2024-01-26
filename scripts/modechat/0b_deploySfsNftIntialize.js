// Deploy FlexiPunkMetadata contract
// npx hardhat run scripts/modechat/0_deploySfsNftIntialize.js --network modeTestnet

const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";
const feeReceiver = "0xE08033d0bDBcEbE7e619c3aE165E7957Ab577961";

async function main() {
  console.log("Create SFS NFT for ModeChat (use it here for Stats, Stats Middleware, Minter and Custom Metadata)");

  const contractName = "SfsNftInitialize";

  const [deployer] = await ethers.getSigners();

  console.log("Using SFS contract address:", sfsAddress);

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract
  const contract = await ethers.getContractFactory(contractName);
  const instance = await contract.deploy(
    sfsAddress,
    feeReceiver
  );

  // wait for deploy finished
  await instance.deployed();

  console.log(contractName, "contract address:", instance.address);

  console.log("fetching NFT token ID...");

  // fetch NFT token ID
  const tokenId = await instance.sfsNftTokenId();
  console.log("SFS NFT token ID:", tokenId.toString());

  console.log("-----------------");

  console.log("Wait a minute and then run this command to verify contracts on Etherscan:");
  console.log("npx hardhat verify --network " + network.name + " " + instance.address + " " + sfsAddress + " " + feeReceiver);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });