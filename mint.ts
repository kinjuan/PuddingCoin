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
import secretJsonDev from "./id-dev.json";
import secretJsonMain from "./id-main.json";
import metadataJson from "./metada.json";
import env from "./env.json";

const dev = false;

const url = () => {
  if (dev) {
    return env["url-dev"];
  }
  return env["url-main"];
};

const secretJson = () => {
  if (dev) {
    return secretJsonDev;
  }
  return secretJsonMain;
};

//Establish Solana Connection
if (!url()) {
  throw "No url setup";
}
const umi = createUmi(url()); //Replace with your QuickNode RPC Endpoint
console.log("Connection stabilished");

if (!secretJson()) {
  throw "No secret found";
}
//Initialize the Signer wallet
const userWallet = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(secretJson())
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
umi.use(signerIdentity(userWalletSigner));
umi.use(mplCandyMachine());

//Function to deploy Mint PDA and mint Tokens
createAndMint(umi, {
  mint,
  authority: umi.identity,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 8,
  amount: 1000000_00000000,
  tokenOwner: userWallet.publicKey,
  tokenStandard: TokenStandard.Fungible,
})
  .sendAndConfirm(umi)
  .then(() => {
    console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
  })
  .catch((error) => console.error(error.message));
