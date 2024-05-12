# Pudding Coin

Recomended to create an account on quickNode to use their RPC connections

## Token on Solana

[PUDDINGCOIN](https://solscan.io/token/A7VZzZDqttm8co8Jd6uwkuEvkCjpW1hDcpPTe4Lb47dy)

### Source of information

[How to Create a Fungible SPL Token on Solana with Metaplex
](https://www.quicknode.com/guides/solana-development/spl-tokens/how-to-create-a-fungible-spl-token-with-the-new-metaplex-token-standard?utm_source=qn-youtube&utm_campaign=DECEMBER2023SOLANA-TOKEN&utm_content=sign-up&utm_medium=generic)

[Metaplex Token Metadata](https://developers.metaplex.com/token-metadata)


## Project setup

Install all dependencies

```
npm install
```

### Create env.json file
Create a file env.json with your Quicknode endpoints for your solana main and dev network

```
{
  "url-main": "",
  "url-dev": ""
}
```

## Scripts
### Create wallet

To create a new wallet that will hold the tokens execute the script below.

After the execution you can import this wallet to phantom/coinbase or other provider by using the secret key

```
npx esrun ./wallet.ts
```

### Create solana token

After the creation of your wallet, you need to create the metadata of your token

#### Create metada.json file

Create metada.json file to set your token metadadata. 

For URI you can use github gist or any other text provider that can deliver a plain json to hold the name, symbol, image and description of your token.
[Example](https://gist.github.com/kinjuan/aa05c0a749070c35ffc836f95815dd5f#file-unstablefrog-json)

```
{
  "name": "NAME",
  "symbol": "SYMBOL",
  "uri": "link-for-metadata",
  "description": "Desc"
}
```

### Create token

To mint(create) your token for the wallet just created previously run

```
npx esrun ./mint.ts
```

Remember to save the Mint Secret key in a safe place, or else it won't be able to update the token later.

### Update token metadata

To update the token metadata you can run the script update-metada.ts

You will need the account and token secrets json files to run the script

The script will read the file metada.json to replace the information. Change updateV1 data as you wish

```
npx esrun ./update-metada.ts
```