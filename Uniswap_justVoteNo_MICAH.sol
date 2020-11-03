// SPDX-License-Identifier: UNLICENSE
pragma solidity 0.7.4;

interface GovernorAlpha {
    function castVote(uint proposalId, bool support) external;
}

contract VoteNoOnPropX {
    GovernorAlpha constant public governorAlpha = GovernorAlpha(0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F);
    function voteNo(uint256 proposalId) external {
        governorAlpha.castVote(proposalId, false);
    }
}
