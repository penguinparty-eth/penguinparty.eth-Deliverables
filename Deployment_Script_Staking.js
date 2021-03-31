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

const liveDate = new Date(Date.now()+(5000*60))

const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()

const rewardsDuration = new BigNumber("86400");

var addresses = { 
    //you must have this in your wallet
    stakingTokenReward: "0x773b687ac8fab18045e336806d7e04ab72e1eddc",
    //the tokens to be staked
    //format: { "Liquidity Pool Address": amount in wei 
    stakingTokenStakedERC20: {
        '0x28cee28a7c4b4022ac92685c07d2f33ab1a0e122': (new BigNumber("1")).mul(WeiPerEth),
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
await factoryContract.deployTransaction.wait(3)

const factoryAddress = factoryContract.address;

console.log("Factory address at ", factoryAddress)

console.log("Start time is at ", liveDate);


console.log("Transferring ", expectedBalance.toString(), " of ", (await erc20.name()), " to ", factoryAddress)
var testTransfer = await erc20.transfer(factoryAddress, expectedBalance);

while((await testTransfer.wait(3)).status === 0) {
    console.log("Transfer failed? trying again")
    testTransfer = await erc20.transfer(factoryAddress, expectedBalance);
}

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