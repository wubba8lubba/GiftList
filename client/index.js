const axios = require("axios");
const niceList = require("../utils/niceList.json");
const GiftConsensusProxy = require("../utils/giftConsensusProxy");

const serverUrl = "http://localhost:1225";
const proxy = new GiftConsensusProxy(niceList);

const args = process.argv.slice(2);

async function getGift() {
  if (args.length === 0) {
    console.error("Please provide a name as a command-line argument.");
    process.exit(1);
  }

  const proof = proxy.getProofByName(args[0]);
  try {
    const { data: gift } = await axios.post(`${serverUrl}/gift`, {
      name: args[0],
      proof: proof,
    });
    console.log({ gift });
  } catch (error) {
    console.error("Error getting gift:", error);
  }
}

getGift();
