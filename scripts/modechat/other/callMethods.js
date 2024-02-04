// npx hardhat run scripts/modechat/other/callMethods.js --network modeMainnet

const forbiddenAddress = "";
const factoryAddress = "";
const tldAddress = "";
const metadataAddress = "";

const domainPrice = ethers.utils.parseUnits("0.000001", "ether");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Calling methods with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const forbiddenInterface = new ethers.utils.Interface([
    "function factoryAddresses(address) external view returns(bool)",
    "function addFactoryAddress(address _fAddr) external"
  ]);

  const factoryInterface = new ethers.utils.Interface([
    "function tldNamesAddresses(string memory) external view returns(address)",
    "function ownerCreateTld(string memory _name, string memory _symbol, address _tldOwner, uint256 _domainPrice, bool _buyingEnabled) external returns(address)"
  ]);

  const tldInterface = new ethers.utils.Interface([
    "function buyingEnabled() external view returns(bool)",
    "function changePrice(uint256 _price) external",
    "function domainIdsNames(uint256 _tokenId) external view returns(string memory)",
    "function mint(string memory,address,address) external payable returns(uint256)",
    "function price() external view returns(uint256)",
    "function toggleBuyingDomains() external",
    "function tokenURI(uint256) external view returns(string memory)"
  ]);

  const metadataInterface = new ethers.utils.Interface([
    "function getMetadata(string calldata _domainName, string calldata _tld, uint256 _tokenId) external view returns(string memory)"
  ]);

  const forbiddenContract = new ethers.Contract(forbiddenAddress, forbiddenInterface, deployer);
  const factoryContract = new ethers.Contract(factoryAddress, factoryInterface, deployer);
  const tldContract = new ethers.Contract(tldAddress, tldInterface, deployer);
  const metadataContract = new ethers.Contract(metadataAddress, metadataInterface, deployer);

  //const minterBefore = await contract.minter();
  //console.log("Minter before: " + minterBefore);

  // ADD FACTORY ADDRESS TO THE FORBIDDEN CONTRACT
  //await forbiddenContract.addFactoryAddress(factoryAddress);

  //const factoryAdded = await forbiddenContract.factoryAddresses(factoryAddress);
  //console.log("factoryAdded:");
  //console.log(factoryAdded);

  //await minterContract.togglePaused();
  //await minterContract.transferOwnership(newOwnerAddress);

  // CREATE A NEW TLD
  /* */
  const tldName = ".savm";
  const tldSymbol = ".SAVM";
   
  /* */
  const tx = await factoryContract.ownerCreateTld(
    tldName, // TLD name
    tldSymbol, // symbol
    deployer.address, // TLD owner
    domainPrice, // domain price
    true // buying enabled
  );

  tx.wait();
  
  
  /*
  const tldAddr = await factoryContract.tldNamesAddresses(tldName);
  
  console.log("TLD address: ");
  console.log(tldAddr);
  */

  // toggle buying domains
  //await tldContract.toggleBuyingDomains();

  // check buyingEnabled state
  //const buyingEnabled = await tldContract.buyingEnabled();
  //console.log("buyingEnabled:", buyingEnabled);

  // change price
  //await tldContract.changePrice(domainPrice);

  // check price
  //const price = await tldContract.price();
  //console.log("price:", Number(price));

  // Mint a domain name
  /* 
  await tldContract.mint(
    "tempe", // domain name (without TLD)
    deployer.address, // domain holder
    ethers.constants.AddressZero, // referrer
    {
      value: domainPrice // pay  for the domain
    }
  );
  */

  //const metadata = await tldContract.tokenURI(1);
  //console.log("metadata:");
  //console.log(metadata);

  // GET METADATA FROM THE METADATA CONTRACT
  /*
  const metadata = await metadataContract.getMetadata(
    "tempe", // domain name (without TLD)
    ".fantom", // TLD
    1 // token ID
  );

  console.log("metadata:");
  console.log(metadata);
  */

  // GET DOMAIN NAME FROM THE TLD CONTRACT
  /*
  const tokenId = 657; //954;
  const domainName = await tldContract.domainIdsNames(tokenId);
  console.log(domainName);
  console.log("domainName:", domainName);
  */

  console.log("Method calls completed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });