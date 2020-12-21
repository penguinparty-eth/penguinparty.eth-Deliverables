# penguinparty.eth-Deliverables
A repo to house our software deliverables as they are being developed and launched.

SOLIDITY CONTRACTS:

///////////////////////////////////////////////////////////////////////////////////


- CommonWealth-TokenStandard.sol - An easy-to-use token contract.

Features:
- Ownability - An Admin contract or user can manage several functions of the contract with openZeppelin's ownability modifier.
- Fee on Transfer - A fee on transfer of the token can be charged and sent to a destination address determined by the admin contract or user.
- Name and Symbol updatability - The Name and Symbol of the Token can be updated by the Admin contract or User in case of errors during deployment or other advanced use-case such as deprecation of old contracts and reclamation of namespace.
- Mintability - An admin contract or user can mint new tokens.
- Burnability - Tokens are destroyable by an admin user or contract.

///////////////////////////////////////////////////////////////////////////////////

GENERAL TOKEN CONTRACTS FOR ON-CHAIN DEPLOYMENTS

///////////////////////////////////////////////////////////////////////////////////


- Fish/🐟.sol - Penguin Party's Internal Governance token, a standard ERC20 built on the OpenZeppelin implementation of the ERC20 token standard.

- Shrimp/wrappedDelegatedUni_fees.sol - Penguin Party's Shrimp Contract - A wrapped-delegated UNI Contract with a fee on transfer().

- Crab/wrappedDelegatedComp_fees.sol - Penguin Party's Crab Contract - A wrapped-delegated COMP Contract with a fee on transfer().

///////////////////////////////////////////////////////////////////////////////////

TORI & COMMONWEALTH PROTOCOL

///////////////////////////////////////////////////////////////////////////////////


- Tori/tori_v1.sol - a wrapped and interest-redirected Aave V1 aToken contract with a fee on transfer.

- Tori/tori_v2.sol - An experimental MetaStablecoin protocol and token contract for wrapping and unwrapping various stablecoins in to a metastablecoin token.

- Tori/tori_v3.sol - An update for the Commonwealth MetaStablecoin protocol fixing several critical flaws in the math controlling the deflationary aspects of the token's tokenomics in v2.

///////////////////////////////////////////////////////////////////////////////////

PENGUINSWAP

///////////////////////////////////////////////////////////////////////////////////

PenguinSwap/penguinswap_router.sol - An Experimental fork of the Uniswap Router Contract for PenguinSwap's purposes.

PenguinSwap/StakingRewardsFactory.sol - A copy of Uniswap's Staking Contract that was used during liquidity mining that could be repurposed for PenguinSwap.

PenguinSwap/Uniswap_justVoteNo.sol - Micah's Contributed experimental changes to the Autonomous Proposal Factory.
