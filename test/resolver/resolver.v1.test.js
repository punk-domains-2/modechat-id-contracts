// npx hardhat test test/resolver/resolver.v1.test.js
const { expect } = require('chai');

const contractName = "PunkResolverV1";
 
describe(contractName, function () {
  let contract;
  let forbTldsContract;
  let factoryContract1;
  let factoryContract2;
  let factoryContract3;

  let signer;
  let user1;
  let user2;

  beforeEach(async function () {
    [signer, user1, user2, feeReceiver] = await ethers.getSigners();

    const MockSFS = await ethers.getContractFactory("MockSFS");
    const sfsContract = await MockSFS.deploy();

    const SfsNftInitialize = await ethers.getContractFactory("SfsNftInitialize");
    const sfsNftInitializeContract = await SfsNftInitialize.deploy(sfsContract.address, feeReceiver.address);

    const sfsNftTokenId = await sfsNftInitializeContract.sfsNftTokenId();

    const contractCode = await ethers.getContractFactory(contractName);
    contract = await contractCode.deploy();

    const PunkForbiddenTlds = await ethers.getContractFactory("PunkForbiddenTlds");
    forbTldsContract = await PunkForbiddenTlds.deploy(sfsContract.address, sfsNftTokenId);

    const PunkTLDFactory = await ethers.getContractFactory("PunkTLDFactory");
    factoryContract1 = await PunkTLDFactory.deploy(ethers.utils.parseUnits("1", "ether"), forbTldsContract.address);
    factoryContract2 = await PunkTLDFactory.deploy(ethers.utils.parseUnits("2", "ether"), forbTldsContract.address);
    factoryContract3 = await PunkTLDFactory.deploy(ethers.utils.parseUnits("3", "ether"), forbTldsContract.address);

    await forbTldsContract.addFactoryAddress(factoryContract1.address);
    await forbTldsContract.addFactoryAddress(factoryContract2.address);
    await forbTldsContract.addFactoryAddress(factoryContract3.address);
  });
  
  //it('', async function () {});
});