# This is Secret App

## Getting Started

## Development

Install `yarn` globally

```bash
nvm install 18
npm i -g yarn
```

To set up local dependencies and stay consistent with CI use the `yarn` package manager

```bash
yarn install
```

To start a local server:

1. Create local environment `cp .env.template .env.local`
2. Edit `.env.local`, set dynamodb env variable value.
3. Run `yarn dev`.
4. Goto http://localhost:3000

### Use local dynamodb

Add `DYNAMODB_ENDPOINT=http://localhost:8000` to file `.env.local` at project root.

Run `yarn start:db:local` and then Run `yarn dev`.
