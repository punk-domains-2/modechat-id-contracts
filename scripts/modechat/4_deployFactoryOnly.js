// Deploy factory contract only (ForbiddenTlds and FlexiPunkMetadata need to be already deployed)
// after deployment, factory address will be automatically added to the ForbiddenTlds whitelist and to the Resolver
// if not, do it manually
// npx hardhat run scripts/modechat/4_deployFactoryOnly.js --network modeTestnet

async function main() {
  const contractNameFactory = "FlexiPunkTLDFactory";

  const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";
  const sfsNftTokenId = 0; // TODO: Enter SFS NFT token ID!!!

  if (sfsNftTokenId == 0) {
    console.log("Please enter SFS NFT token ID!!!");
    return;
  }

  const metaAddress = "";
  const forbAddress = "";
  const resolverAddress = ""; // IMPORTANT: this script is made for non-upgradable Resolver. If you're using upgradable Resolver, you need to modify this script below (find: PunkResolverNonUpgradable line)

  const domainName = ".modechat";
  const domainSymbol = ".MODECHAT";

  let tldPrice = "40"; // default price in ETH

  // mainnet prices
  if (network.config.chainId === 255) {
    tldPrice = "40"; // ETH
  } else if (network.config.chainId === 137) {
    tldPrice = "80000"; // MATIC
  } else if (network.config.chainId === 100) {
    tldPrice = "75000"; // XDAI
  } else if (network.config.chainId === 56) {
    tldPrice = "250"; // BNB
  } else if (network.config.chainId === 19) {
    tldPrice = "2000000"; // SGB
  } else if (network.config.chainId === 250) {
    tldPrice = "270000"; // FTM
  }

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract1
  const contractFactory = await ethers.getContractFactory(contractNameFactory);

  const tldPriceWei = ethers.utils.parseUnits(tldPrice, "ether");
  const instanceFactory = await contractFactory.deploy(
    tldPriceWei, 
    sfsAddress,
    forbAddress, 
    sfsNftTokenId,
    metaAddress
  );

  await instanceFactory.deployed();

  console.log("Factory contract deployed to:", instanceFactory.address);

  await sleep(1000);

  console.log("Adding factory contract to the ForbiddenTlds whitelist");

  // add factory address to the ForbiddenTlds whitelist
  const contractForbiddenTlds = await ethers.getContractFactory("PunkForbiddenTlds");
  const instanceForbiddenTlds = await contractForbiddenTlds.attach(forbAddress);

  const tx1 = await instanceForbiddenTlds.addFactoryAddress(instanceFactory.address);
  await tx1.wait();

  await sleep(1000);

  console.log("Done!");

  console.log("Adding factory contract to the Resolver");

  // add factory address to the Resolver
  const contractResolver = await ethers.getContractFactory("PunkResolverNonUpgradable");
  const instanceResolver = await contractResolver.attach(resolverAddress);

  const tx2 = await instanceResolver.addFactoryAddress(instanceFactory.address);
  await tx2.wait();

  await sleep(1000);

  console.log("Done!");

  // create a new TLD
  console.log("Creating a new TLD...");

  const tx3 = await instanceFactory.ownerCreateTld(
    domainName, // TLD name
    domainSymbol, // TLD symbol
    deployer.address, // TLD owner
    0, // domain price
    false // public minting disabled (only minter contract can mint new domains)
  );
  await tx3.wait();

  await sleep(1000);

  // get the new TLD contract address
  const tldAddress = await instanceFactory.tldNamesAddresses(domainName);
  console.log("------");
  console.log("TLD contract address:", tldAddress);
  console.log("------");

  console.log("Wait a minute and then run this command to verify contracts on Etherscan:");
  console.log("npx hardhat verify --network " + network.name + " " + instanceFactory.address + ' "' + tldPriceWei + '" ' + sfsAddress + " " + forbAddress + ' "' + sfsNftTokenId + '" ' + metaAddress);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });