# This is Secret App

This is web app providing random presaved secret for users who have signed in using their polkdot wallet.
It securely sign in user by asking wallet message sign requests and the signed message gets verified before a client session can be given to the browser.
It supports wallet switch, which will automatically

## Feature list

1. It's a production ready app based on nextjs ecosystem to drastically cutting off development effort
2. It's using next-auth as opinonated authentication layer, it has fine tuned the session timeout and advanced secruity headers
3. It uses Material UI as frontend library.
4. Both frontend and backend code are almost fully covered by unit tests whereever possible
5. The data persistence layer is AWS dynamodb for its simplicity in terms of dev and deployment
6. The web app can be easily run locally connected to a local dynamodb, a cloud one, or deployed via Vercel

## Todo list

1. being able to add secret by user
2. authorization for user for secret that created by them, and others should not be able to see these
3. integration tests such cypress could be done

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
2. Edit `.env.local`, set env variable value.
3. Run `yarn dev`.
4. Goto http://localhost:3000

### Use local dynamodb

Run `yarn start:db:local` and then Run `yarn dev`.

### troubleshooting

1. Test blocked with `message Determing test suites to run...`, After waiting for a period of time, the following error is output.

   `Exception in thread "main" java.io.IOException: Failed to bind to 0.0.0.0/0.0.0.0:8100`

   This is because the local dynamodb test is enabled and requires an available port. This problem will occur if it is occupied. This can be fixed by modifying the port numbers of `DYNAMODB_ENDPOINT` and `DYNAMODB_PORT` in `.env.test`

   Note: If dynamodb-local is enabled through docker, it will also cause this problem, please modify our test port to avoid this problem

## Deployment

1. Initialize dynamodb
   - create environment file `cp .env.template .env.devops`, and set env variable value
   - run `yarn init:db`

2. go to [vercel](https://vercel.com/dashboard) to create a new project
3. connect and choose to import a git repository
4. type a project name and choose `Next.js` as framework preset
5. add environment variables
   - S_AWS_ACCESS_KEY, S_AWS_SECRET_KEY, S_AWS_REGION, for dynamodb access
   - JWT_SECRET, can be generate use the command: `node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"`
6. click to deploy
