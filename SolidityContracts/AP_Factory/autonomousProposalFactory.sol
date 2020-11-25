// SPDX-License-Identifier: GPL-3.0
// forked from Compound's autonomous proposal Factory @0x524B54a6A7409A2Ac5b263Fb2A41DAC9d155ae71
// refactored by the penguin party @penguinparty.eth

pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

interface IUni {
    function delegate(address delegatee) external;
    function balanceOf(address account) external view returns (uint);
    function transfer(address dst, uint rawAmount) external returns (bool);
    function transferFrom(address src, address dst, uint rawAmount) external returns (bool);
}

interface IGovernorAlpha {
    function propose(address[] memory targets, uint[] memory values, string[] memory signatures, bytes[] memory calldatas, string memory description) external returns (uint);
    function castVote(uint proposalId, bool support) external;
}

contract CrowdProposal {
    /// @notice Governance proposal data
    address[] public targets;
    uint[] public values;
    string[] public signatures;
    bytes[] public calldatas;
    string public description;

    /// @notice Uniswap protocol `GovernorAlpha` contract address
    address public immutable governor;

    /// @notice Governance proposal id
    uint public govProposalId;
    /// @notice Terminate flag
    bool public terminated;

    /// @notice An event emitted when the governance proposal is created
    event CrowdProposalProposed(address indexed proposal, uint proposalId);
    /// @notice An event emitted when a yes vote is cast
    event CrowdProposalVotedYes(address indexed proposal, uint proposalId);
    /// @notice An event emitted when a no vote is cast
    event CrowdProposalVotedNo(address indexed proposal, uint proposalId);

    /**
    * @notice Construct crowd proposal
    * @param targets_ The ordered list of target addresses for calls to be made
    * @param values_ The ordered list of values (i.e. msg.value) to be passed to the calls to be made
    * @param signatures_ The ordered list of function signatures to be called
    * @param calldatas_ The ordered list of calldata to be passed to each call
    * @param description_ The block at which voting begins: holders must delegate their votes prior to this block
    * @param uni_ `UNI` token contract address
    * @param governor_ Uniswap protocol `GovernorAlpha` contract address
    */
    constructor(
        address[] memory targets_,
        uint[] memory values_,
        string[] memory signatures_,
        bytes[] memory calldatas_,
        string memory description_,
        address uni_,
        address governor_
    ) public {
        // Save proposal data
        targets = targets_;
        values = values_;
        signatures = signatures_;
        calldatas = calldatas_;
        description = description_;

        // Save Uniswap contracts data
        governor = governor_;

        terminated = false;

        // Delegate votes to the crowd proposal
        IUni(uni_).delegate(address(this));
    }

    /// @notice Create governance proposal
    function propose(
    ) external returns (uint) {
        require(govProposalId == 0, 'CrowdProposal::propose: gov proposal already exists');
        require(!terminated, 'CrowdProposal::propose: proposal has been terminated');

        // Create governance proposal and save proposal id
        govProposalId = IGovernorAlpha(governor).propose(targets, values, signatures, calldatas, description);
        emit CrowdProposalProposed(govProposalId);

        voteYes();

        return govProposalId;
    }

    /// @notice Vote yes for the governance proposal with all delegated votes
    function voteYes(
    ) public {
        require(govProposalId > 0, 'CrowdProposal::voteYes: gov proposal has not been created yet');
        IGovernorAlpha(governor).castVote(govProposalId, true);

        emit CrowdProposalVotedYes(govProposalId);
    }

    /// @notice Vote no for any other governance proposal with all delegated votes
    function voteNo(
        uint256 proposalId_
    ) external {
        require(proposalId_ != govProposalId, 'CrowdProposal::voteNo: cannot vote no on this proposal');
        IGovernorAlpha(governor).castVote(proposalId_, false);
        emit CrowdProposalVotedNo(proposalId_);
    }
}


contract CrowdProposalFactory {
    /// @notice `UNI` token contract address
    address public immutable uni;
    /// @notice Uniswap protocol `GovernorAlpha` contract address
    address public immutable governor;

    /// @notice An event emitted when a crowd proposal is created
    event CrowdProposalCreated(address indexed proposal, address[] targets, uint[] values, string[] signatures, bytes[] calldatas, string description);

    /**
    * @notice Construct a proposal factory for crowd proposals
    * @param uni_ `UNI` token contract address
    * @param governor_ Uniswap protocol `GovernorAlpha` contract address
    * @param uniStakeAmount_ The minimum amount of uni tokes required for creation of a crowd proposal
    */
    constructor(
        address uni_,
        address governor_
    ) public {
        uni = uni_;
        governor = governor_;
    }

    /**
    * @notice Create a new crowd proposal
    * @param targets The ordered list of target addresses for calls to be made
    * @param values The ordered list of values (i.e. msg.value) to be passed to the calls to be made
    * @param signatures The ordered list of function signatures to be called
    * @param calldatas The ordered list of calldata to be passed to each call
    * @param description The block at which voting begins: holders must delegate their votes prior to this block
    */
    function createCrowdProposal(
        address[] memory targets,
        uint[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external {
        CrowdProposal proposal = new CrowdProposal(targets, values, signatures, calldatas, description, uni, governor);
        emit CrowdProposalCreated(address(proposal), targets, values, signatures, calldatas, description);
    }
}
