key = "********************************************************************"
address = "0x7e9b3179a40e021cd21fcb524815b10040f510d4"

const day = 24 * 60 * 60
const rewardsDuration = 60 * day
const ethUniPoolAddress = "0xd3d2E2692501A5c9Ca623199D38826e513033a17"
const uni = require("./uni.js")
const stakingRewardsFactory = require("./stakingRewardsFactory.js")
const crowdProposalFactory = require("./crowdProposalFactory.js")

const Web3 = require("web3")

var web3 = new Web3("https://mainnet.infura.io/v3/24a7a884ec784b429c0b1c77c8b1a9b7")
web3.eth.accounts.wallet.add(key)

const uniContract = new web3.eth.Contract(uni.abi, uni.address)
const stakingRewardsFactoryContract = new web3.eth.Contract(stakingRewardsFactory.abi, stakingRewardsFactory.address)
const liqMiningAllocation = "5000000000000000000000000"
const transferCallData = uniContract.methods.transfer(stakingRewardsFactory.address, liqMiningAllocation).encodeABI()
const deployCallData = stakingRewardsFactoryContract.methods.deploy(ethUniPoolAddress, liqMiningAllocation, rewardsDuration).encodeABI()
const notifyRewardAmountCallData = stakingRewardsFactoryContract.methods.notifyRewardAmount(ethUniPoolAddress).encodeABI()




crowdProposalFactoryContract = new web3.eth.Contract(crowdProposalFactory.abi, crowdProposalFactory.address)

crowdProposalFactoryContract.methods.createCrowdProposal(
  [uni.address,stakingRewardsFactory.address,stakingRewardsFactory.address],//targets
  [0,0,0],//values
  ["","",""],//signatures
  //[[stakingRewardsFactoryAddress, liqMiningAllocation], [ethUniPoolAddress, liqMiningAllocation, rewardsDuration],[ethUniPoolAddress]],
  [transferCallData, deployCallData, notifyRewardAmountCallData],//calldatas
  "# Fund a 60 day UNI-ETH liquidity mining pool with 5M UNI\n This proposal creates a UNI-ETH liquidity mining pool with the same configuration as the current pools (5 million UNI over 60 days).\n We believe that this proposal will return value to UNI holders by creating incentives to hold UNI and by increasing UNI liquidity. This proposal has the added benefit of drawing UNI from centralised exchanges that may have the incentive to vote against the best interests of Uniswap. \n Run a simulation of this proposal [here](https://github.com/businessfriendlyusername/ETH-UNI-pool-proposal)\n\n signed penguinparty.eth"//description
).send({from: address, gas: 5000000})