const Factory = artifacts.require('uniswapv2/UniswapV2Factory.sol');
const Router = artifacts.require('uniswapv2/UniswapV2Router02.sol');
// const WETH = artifacts.require('WETH.sol');
// const MockERC20 = artifacts.require('MockERC20.sol');
const ForestToken = artifacts.require('ForestToken.sol') 
const Farmer = artifacts.require('Farmer.sol'); 
const Farm = artifacts.require('Plantation.sol');
const SeedMaker = artifacts.require('SeedMaker.sol');
const Migrator = artifacts.require('Migrator.sol');

module.exports = async function(deployer, _network, addresses) {
  const [admin, _] = addresses;

  const addrETH = '0x65976a250187cb1D21b7e3693aCF102d61c86177';
  const addrUSDT = '0x0a5bD0108227B3DFeC64199D6939841eeCF47a8E';
  const addrDAI = '0x7aD98AeADbbCdF3693B0b53C09dA4033704C9322';
  const addrUSDC = '0x2578C6c1ac883443388edd688ca10E87d088BfA8';
  const addrWBTC = '0x6fbF8F06Ebce724272813327255937e7D1E72298';
  const addrAAVE = '0x9E7C05e787bAC79730EcA196CFab2b1b53F2Ff47';
  const addrCRV = '0xD3d383799d3a36B2279e7741b80ec3BdaBAE4b80';
  const addrSushi = '0xB3fd58EDA12A6E5577a962aaaA3B15037E756EB4';
  const addrWNEON = '0xf8ad328e98f85fccbf09e43b16dcbbda7e84beab';
  const addrBal = '0xC60911b5577F10F582914205d61C64622A6924d8';

  // await deployer.deploy(WETH);
  // const weth = await WETH.deployed();

  // //TODO: Change ToeknA and B to something meaningfull
  // const tokenA = await MockERC20.new('Token A', 'TKA', web3.utils.toWei('1000'));
  // const tokenB = await MockERC20.new('Token B', 'TKB', web3.utils.toWei('1000'));

  await deployer.deploy(Factory, admin);
  const factory = await Factory.deployed();
  // await factory.createPair(weth.address, tokenA.address);
  // await factory.createPair(weth.address, tokenB.address);
  await factory.createPair(addrWNEON, addrETH);
  await factory.createPair(addrWNEON, addrUSDT);
  await factory.createPair(addrWNEON, addrUSDC);
  await factory.createPair(addrWNEON, addrWBTC);
  await factory.createPair(addrWNEON, addrAAVE);
  await factory.createPair(addrWNEON, addrDAI);
  await factory.createPair(addrWNEON, addrSushi);
  await factory.createPair(addrWNEON, addrCRV);

  await deployer.deploy(Router, factory.address, addrWNEON);
  const router = await Router.deployed();

  //TODO: Replace Sushi to our token
  await deployer.deploy(ForestToken);
  const forestToken = await ForestToken.deployed();

  await deployer.deploy(
    Farmer,
    forestToken.address,
    admin,
    web3.utils.toWei('100'),
    1, // TODO: change for mainnet
    10 // TODO: change for mainnet??
  );
  const farmer = await Farmer.deployed();
  await forestToken.transferOwnership(Farmer.address);

  //TODO: Rename SushiBar to {OurName}Bar
  await deployer.deploy(Farm, ForestToken.address);
  const farm = await Farm.deployed();

  //TODO: Rename Sushimaker to {Ourname}Maker
  await deployer.deploy(
    SeedMaker,
    factory.address, 
    farm.address, 
    ForestToken.address, 
    // weth.address,
    addrWNEON
  );
  const seedMaker = await SeedMaker.deployed();
  await factory.setFeeTo(seedMaker.address);

  await deployer.deploy(
    Migrator,
    farmer.address,
    // '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    addrSushi,
    factory.address,
    1 // TODO: change for mainnet
  );
};
