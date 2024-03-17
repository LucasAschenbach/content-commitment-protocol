// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ZertifyRegistry {
	struct Sig {
		uint8 v;
		bytes32 r;
		bytes32 s;
	}

	// hash(C) -> signatures
	mapping (bytes32 => Sig[]) public attestations;

	mapping (address => bool) public invalidated;

	event AttestationSubmitted(bytes32 commitment, address pk);

	function submitAttestation(bytes32 _commitment, Sig memory _signature) external {
		address signer = ECDSA.recover(_commitment, _signature.v, _signature.r, _signature.s);
		require(!invalidated[signer]);
		attestations[_commitment].push(_signature);
		emit AttestationSubmitted(_commitment, signer);
	}

	function invalidate() external {
		invalidated[msg.sender] = true;
	}
}
