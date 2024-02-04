// npx hardhat run scripts/modechat/7_deployMinter.js --network modeMainnet
// it automatically adds minter address to the TLD contract as minter

const contractNameFactory = "ModeChatIdMinter";

const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";

const sfsNftTokenId = 286; // TODO: Enter SFS NFT token ID!!!

const statsAddress = "0xb29e981343daa6ea18D58cdB0800DFE962aA53e4"; // stats middleware contract address
const distributorAddress = "0x20aeB41bCfaFb05b580dB2f687123eDa605315Ed";
const tldAddress = "0x523a7050df3DC7E96B7faAF4dDECCc244d886a90";

const paymentTokenDecimals = 18;

const price1char = ethers.utils.parseUnits("1", paymentTokenDecimals);
const price2char = ethers.utils.parseUnits("0.1", paymentTokenDecimals);
const price3char = ethers.utils.parseUnits("0.03", paymentTokenDecimals);
const price4char = ethers.utils.parseUnits("0.008", paymentTokenDecimals);
const price5char = ethers.utils.parseUnits("0.0006", paymentTokenDecimals);

async function main() {
  if (sfsNftTokenId == 0) {
    console.log("Please enter SFS NFT token ID!!!");
    return;
  }

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract
  const contract = await ethers.getContractFactory(contractNameFactory);
  const instance = await contract.deploy(
    sfsAddress, distributorAddress, sfsNftTokenId, statsAddress, tldAddress,
    price1char, price2char, price3char, price4char, price5char
  );

  await instance.deployed();

  console.log("Contract address:", instance.address);

  // add minter address to the TLD contract
  console.log("Adding minter address to the TLD contract...");
  const contractTld = await ethers.getContractFactory("FlexiPunkTLD");
  const instanceTld = await contractTld.attach(tldAddress);

  const tx1 = await instanceTld.changeMinter(instance.address);
  await tx1.wait();

  // add minter address to the stats middleware contract
  console.log("Adding minter address to the stats middleware contract...");
  const contractStats = await ethers.getContractFactory("StatsMiddleware");
  const instanceStats = await contractStats.attach(statsAddress);

  const tx2 = await instanceStats.addWriter(instance.address);
  await tx2.wait();

  console.log("Done!");

  console.log("Wait a minute and then run this command to verify contract on the block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + instance.address + " " + sfsAddress + " " + distributorAddress + ' "' + sfsNftTokenId + '" ' + statsAddress + " " + tldAddress + ' "' + price1char + '" "' + price2char + '" "' + price3char + '" "' + price4char + '" "' + price5char + '"');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });