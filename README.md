# puddingcoind

Recomended to create an account on quickNode to use their RPC connections

### Tutorial link

https://www.quicknode.com/guides/solana-development/spl-tokens/how-to-create-a-fungible-spl-token-with-the-new-metaplex-token-standard?utm_source=qn-youtube&utm_campaign=DECEMBER2023SOLANA-TOKEN&utm_content=sign-up&utm_medium=generic

### Metaplex library

https://developers.metaplex.com/


## Project setup
```
npm install
```

### Create env.json file
Add on env.json your Quicknode endpoints for your solana main and dev network

```
{
  "url-main": "",
  "url-dev": ""
}
```

### Run wallet script

To create the wallet the will hold the tokens. you can import this wallet to phantom/coinbase or other provider

```
npx esrun ./wallet.ts
```

### Create metada.json file

Create metada.json file to set your token metadadata

```
{
  "name": "NAME",
  "symbol": "SYMBOL",
  "uri": "link-formetadata",
  "description": "Desc"
}
```

### Run mint script

Mint(create) you token for the walllet created previouly

```
npx esrun ./mint.ts
```