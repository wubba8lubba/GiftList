const express = require("express");
const niceList = require("../utils/niceList.json");
const GiftConsensusProxy = require("../utils/giftConsensusProxy");

const port = 1225;

const app = express();
app.use(express.json());

app.post("/gift", (req, res) => {
  try {
    const proxy = new GiftConsensusProxy(niceList);
    const body = req.body;
    const { name, proof } = body;
    const isInTheList = proxy.verifyProof(proof, name);
    if (isInTheList) {
      res.send("You got a toy robot!");
    } else {
      res.send("You are not on the list :(");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
