import {
  Keypair,
  LAMPORTS_PER_SOL,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import * as fs from "fs";
import bs58 from "bs58";
import env from "./env.json";

const dev = false;

function url() {
  if (dev) {
    return env["url-dev"];
  }
  return env["url-main"];
}

if (!url()) {
  throw "No url setup";
}

//STEP 1 - Connect to Solana Network
//Replace with your QuickNode RPC Endpoint
const endpoint = url();
const solanaConnection = new Connection(endpoint);

//STEP 2 - Generate a New Solana Wallet
const keypair = Keypair.generate();
console.log("Generated new KeyPair");
console.log(`PublicKey..: `, keypair.publicKey.toString());
console.log(`SecretKey..: `, keypair.secretKey.toString());

//STEP 3 - Convert Private key to Base58
const privateKey = bs58.encode(keypair.secretKey);
console.log(`PrivateKey.:`, privateKey);

//STEP 4 - Write Wallet Secret Key to a .JSON
const secret_array = keypair.secretKey
  .toString() //convert secret key to string
  .split(",") //delimit string by commas and convert to an array of strings
  .map((value) => Number(value)); //convert string values to numbers inside the array

const secret = JSON.stringify(secret_array); //Covert to JSON string

fs.writeFile("guideSecret-main.json", secret, "utf8", function (err) {
  if (err) throw err;
  console.log("Wrote secret key to guideSecret.json.");
});

//STEP 5 - Airdrop 1 SOL to new wallet
(async () => {
  const airdropSignature = solanaConnection.requestAirdrop(
    keypair.publicKey,
    2
  );
  try {
    const txId = await airdropSignature;
    console.log(`Airdrop Transaction Id: ${txId}`);
    console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`);
  } catch (err) {
    console.log(err);
  }
})();
