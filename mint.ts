import {
  percentAmount,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import {
  TokenStandard,
  createAndMint,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import "@solana/web3.js";
import accountDev from "./account-dev.json";
import accountMain from "./account-main.json";
import metadataJson from "./metada.json";
import env from "./env.json";
import * as fs from "fs";

const dev = true;

const url = () => {
  if (dev) {
    return env["url-dev"];
  }
  return env["url-main"];
};

const accountJson = () => {
  if (dev) {
    return accountDev;
  }
  return accountMain;
};

if (!url()) {
  throw "No url setup";
}

if (!accountJson()) {
  throw "No account secret found";
}

//Establish Solana Connection
const umi = createUmi(url());
console.log("Connection stabilished");

//Initialize the Signer wallet
const userWallet = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(accountJson())
);

const userWalletSigner = createSignerFromKeypair(umi, userWallet);

if (!metadataJson) {
  throw "No metada json found";
}
//Creating the Metadata variable
const metadata = metadataJson;

//Creating the Mint PDA(Program Derived Address)
const mint = generateSigner(umi);
console.log("Mint created");
console.log(`Mint PublicKey: ${mint.publicKey}`);
console.log("================ SAVE THE SECRET KEY TO UPDATE ================");
console.log(`Mint secretKey: ${mint.secretKey}`);
console.log("=================+=============================================");

//Write Token Secret Key to a .JSON
const secret_array = mint.secretKey
  .toString() //convert secret key to string
  .split(",") //delimit string by commas and convert to an array of strings
  .map((value) => Number(value)); //convert string values to numbers inside the array

const secret = JSON.stringify(secret_array); //Covert to JSON string

fs.writeFile("token.json", secret, "utf8", function (err) {
  if (err) throw err;
  console.log("Wrote token secret key to token.json. Save it properly");
});

umi.use(signerIdentity(userWalletSigner));
umi.use(mplCandyMachine());
const decimal = 1; //0-9
const amount = BigInt(18446744073709549999); // Closest to max allowed

//Function to deploy Mint PDA and mint Tokens
createAndMint(umi, {
  mint,
  isMutable: true,
  authority: umi.identity,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  sellerFeeBasisPoints: percentAmount(0),
  decimals: decimal,
  amount: amount,
  tokenOwner: userWallet.publicKey,
  tokenStandard: TokenStandard.Fungible,
})
  .sendAndConfirm(umi)
  .then((response: any) => {
    console.log("Successfully minted token (", mint.publicKey, ")");
  })
  .catch((error) => console.error(error.message));
