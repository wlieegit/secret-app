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

### troubleshooting

1. Test blocked with `message Determing test suites to run...`, After waiting for a period of time, the following error is output.

   `Exception in thread "main" java.io.IOException: Failed to bind to 0.0.0.0/0.0.0.0:8100`

   This is because the local dynamodb test is enabled and requires an available port. This problem will occur if it is occupied. This can be fixed by modifying the port numbers of `DYNAMODB_ENDPOINT` and `DYNAMODB_PORT` in `.env.test`

   Note: If dynamodb-local is enabled through docker, it will also cause this problem, please modify our test port to avoid this problem
