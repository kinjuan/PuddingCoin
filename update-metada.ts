import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  fetchMetadataFromSeeds,
  mplTokenMetadata,
  updateV1,
} from "@metaplex-foundation/mpl-token-metadata";
import accountDev from "./account-dev.json";
import accountMain from "./account-main.json";
import metadataJson from "./metada.json";
import tokenJson from "./token-dev.json";
import env from "./env.json";
import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";

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

if (!accountJson()) {
  throw "No account secret found";
}

//Establish Solana Connection
if (!url()) {
  throw "No url setup";
}

if (!tokenJson) {
  throw "No token json found";
}
// Use the RPC endpoint of your choice.
const umi = createUmi(url()).use(mplTokenMetadata());

//Initialize the Signer wallet
const userWallet = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(accountJson())
);
const userWalletSigner = createSignerFromKeypair(umi, userWallet);
umi.use(signerIdentity(userWalletSigner));

const keyPair = umi.eddsa.createKeypairFromSecretKey(
  Uint8Array.from(tokenJson)
);
console.log(`KeyPair Pub: ${keyPair.publicKey}`);
console.log(`KeyPair Sec: ${keyPair.secretKey}`);

const initialMetadata = await fetchMetadataFromSeeds(umi, {
  mint: keyPair.publicKey,
});
console.log("Metadata loaded");

if (!metadataJson) {
  throw "No metada json found";
}
//Creating the Metadata variable
const metadata = metadataJson;

await updateV1(umi, {
  mint: keyPair.publicKey,
  authority: umi.identity,
  //NEW INFO
  data: {
    ...initialMetadata,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
  },
})
  .sendAndConfirm(umi)
  .then((response: any) => {
    console.log("Successfully updated token (", keyPair.publicKey, ")");
    console.log(response.result);
  })
  .catch((error) => console.error(error.message));
