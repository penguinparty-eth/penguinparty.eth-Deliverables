(async () => {

/*
    CONSTANTS --------
*/
try {
const BigNumber = ethers.utils.BigNumber;
const WeiPerEth = new BigNumber("1000000000000000000");


/*
    USER DEFINED CONSTANTS --------
*/

const liveDate = new Date(1617642000)

const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()

const rewardsDuration = new BigNumber("7776000"); //90 days = 7776000 seconds, 7.776×10^6 seconds

var addresses = {
    //you must have this in your wallet
    stakingTokenReward: "0x838F9b8228a5C95a7c431bcDAb58E289f5D2A4DC", //fish
    //the tokens to be staked
    //format: { "Liquidity Pool Address": amount in wei
    stakingTokenStakedERC20: {
        '0x5fD8E3112676f69a3613c19597778E6f7A902d7C': (new BigNumber("2500")).mul(WeiPerEth), //fish-to-uni
        '0xB1637bE0173330664adecB343faF112Ca837dA06': (new BigNumber("2500")).mul(WeiPerEth), //fish-to-weth
        '0x6109443fcaf515a23f30248eba1e5ebeb7f53c55': (new BigNumber("2500")).mul(WeiPerEth), //fish-to-tori
        '0xb25e6db21929badf86c6711367d5bd0ea622f42d': (new BigNumber("2500")).mul(WeiPerEth), //fish-to-usdc
    }
}

/*
    INTERNAL --------
*/
console.log("Connected to signer ", await signer.getAddress())
var expectedBalance = new BigNumber("0");

Object.keys(addresses.stakingTokenStakedERC20).forEach(address => {
    const val = addresses.stakingTokenStakedERC20[address];
    console.log("Expecting to add ", val.toString() ," for reward for token ", address)
    expectedBalance = expectedBalance.add(val);
})

console.log("Total expecting to add: ", expectedBalance.toString())

function dateToUnixTimestamp(d) {
    return parseInt((d.getTime() / 1000).toFixed(0))
}
async function getContractFactory(contractName) {
    const fileName = 'browser/artifacts/'.concat(contractName,'.json')
    console.log("getContractFactory retrieving file ", fileName)
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', fileName))
    let factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);
    return factory;
}
/*
    FACTORIES --------
*/

const stakingFactory = await getContractFactory("StakingRewardsFactory");
const ERC20Factory = (await getContractFactory("ERC20"))
const erc20 = ERC20Factory.attach(addresses.stakingTokenReward)
/*
    DEPLOY --------
*/

console.log("Connected to erc20 ", (await erc20.name()))

if((await stakingFactory.signer.getAddress()) !== (await signer.getAddress())) {
    console.error("Failure: signer was not connected");
    throw "Fail";
} else {
    console.log("Signer check succeeded")
}

const _liveDate = dateToUnixTimestamp(liveDate);


console.log("Deploying token for genesis ", _liveDate, " using reward token ", addresses.stakingTokenReward)

var factoryContract = await stakingFactory.deploy(addresses.stakingTokenReward,_liveDate)
console.log("waiting for block to be mined");

const factoryAddress = factoryContract.address;

console.log("Factory address at ", factoryAddress)

console.log("Start time is at ", liveDate);


console.log("Transferring ", expectedBalance.toString(), " of ", (await erc20.name()), " to ", factoryAddress)

console.log("Transfer succeeded")


var theAddresses = []
Object.keys(addresses.stakingTokenStakedERC20).forEach(address => {
    theAddresses.push(address);
});

for(var address of theAddresses) {
    const val = addresses.stakingTokenStakedERC20[address];
    console.log("Deploying staking contract for ", address, " for amount ", val.toString())
    var tx = await factoryContract.deploy(address, val, rewardsDuration);
    var confirmations = await tx.wait(3);
    if(confirmations.status == 1) {
        console.log("Successfully deployed staking contract for staking token ", address)
    } else {
        console.log("Waited 3 confirmations but failed to deploy for staking token ", address)
    }
}

console.log("The factory address is ", factoryAddress)

} catch(e) {
    console.log(e)
    throw "fail";
}
})()
