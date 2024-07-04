const MerkleTree = require("./MerkleTree");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, bytesToHex } = require("ethereum-cryptography/utils");
class GiftConsensusProxy {
  constructor(giftlist) {
    if (!giftlist || giftlist.length === 0) {
      throw new Error("Empty giftlist!");
    }
    this.giftlist = giftlist;
    this.merkleTree = new MerkleTree(this.giftlist);
    this.root = this.merkleTree.getRoot();
    this.concat = (left, right) => keccak256(Buffer.concat([left, right]));
  }

  getProofByName(name) {
    if (!name) throw new Error("Name is required!");
    const index = this.giftlist.findIndex((n) => n === name);
    return this.merkleTree.getProof(index);
  }

  verifyProof(proof, leaf) {
    if (!proof || proof.length === 0) {
      throw new Error("Empty proof!");
    }
    if (!leaf) {
      throw new Error("Leaf is required!");
    }
    proof = proof.map(({ data, left }) => ({
      left,
      data: hexToBytes(data),
    }));
    let data = keccak256(Buffer.from(leaf));

    for (let i = 0; i < proof.length; i++) {
      if (proof[i].left) {
        data = this.concat(proof[i].data, data);
      } else {
        data = this.concat(data, proof[i].data);
      }
    }

    return bytesToHex(data) === this.root;
  }
}

module.exports = GiftConsensusProxy;
