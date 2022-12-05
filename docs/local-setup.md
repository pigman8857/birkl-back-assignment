## Local development setup

### Pre-requisite

- `node` version 14 LTS
- `docker` version 19.03.13+
- `docker-compose` version 1.27.4+ or `docker compose` 
- npm, preferably pnpm
- VSCode extensions
  - `bierner.markdown-mermaid` and `bierner.markdown-emoji` for viewing `.md` files

### Start development

1. Copy .env.example file and rename it to .env.
2. Add new variable for list service 
  ```
  LIST_SERVICE_PORT=4002
  ```

2. Make sure you are in the project root folder and run the following command to Install dependencies.

  ```
  npm run install
  ```

3. Run docker compose to start docker containers in background.

  ```
  docker compose up -d
  ```
  or
  ```
  docker-compose up -d
  ```

4. Make sure Postgres is up and ready to accept connection

  ```
  docker logs -f list-service-db
  ```

5. Initiate database.

  ```
  pnpm db:migrate
  ```
  or
  ```
  npm run db:migrate
  ```
6. Generate TypeScript definition for GraphQL and Prisma client.

  ```
  pnpm codegen
  ```
  or
  ```
  npm run codegen
  ```

7. Start the project in local.
  ```
  `pnpm start` 
  ```
  or
  ```
  npm run start
  ```
- Unit Test 
  To see coverage percentage
  ```
  npm run test:ci
  ```
  To see test the code
  ```
  npm run test
  ```

- See more scripts in `./package.json`

<br/>

## Working with List Service

NoSQL Workbench currently not supports query using CQL, so `kdcro101.vscode-cassandra` VSCode plugin is required.

- Install `kdcro101.vscode-cassandra` plugin
- Open command pallete, and run `Cassandra Workbench: Generate configuration`
- Create a local file `./.cassandraWorkbench.jsonc` containing

  ```json
  [
    {
      "name": "ad_service_local",
      "contactPoints": ["127.0.0.1:9043"]
    }
  ]
  ```
