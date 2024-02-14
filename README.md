# GLM

Questo repository contiene il backend per il nostro sistema gestionale, sviluppato utilizzando AWS CDK, AWS Lambda, API Gateway, DynamoDB e AWS Cognito.

## Folder structure

- **/bin**: Includes executable scripts, particularly for initiating AWS CDK deployments to provision cloud resources.
  - **/glm.ts**:

- **/lib**: Library code supporting the application, divided into specific functionalities:
  - **/api**: Interface or service layer for backend API communication.
  - **/database**: Code related to database operations, models, and connections.
  - **/frontend**: Contains all frontend code, including HTML, CSS, and TypeScript files, organized within a framework's structure of latest React version.
  - **/lambda**: AWS Lambda functions for serverless backend logic.
  - **/glm-stack.ts**:

- **/test**: Test files, including unit and integration tests for both frontend and backend components, using Jest.

- **cdk.json**: Configuration file for the AWS Cloud Development Kit, defining how cloud resources are provisioned.

- **jest.config.js**: Configuration for Jest testing framework, specifying how tests are executed and what patterns to follow.

- **package.json**: Manages npm dependencies, scripts, and project metadata.

- **tsconfig.json**: Configuration for the TypeScript compiler, defining compilation options for the project.


## Requisiti

- Node.js e npm installati sul tuo computer.
- Account AWS con le credenziali di accesso configurate localmente.
- Conoscenza di base di AWS CDK, AWS Lambda, API Gateway, DynamoDB e AWS Cognito.

## Installazione

1. Clona questo repository sul tuo computer:

    ```bash
    git clone https://github.com/richterzo/GLM.git
    ```

3. Installa le dipendenze:

    ```bash
    npm install
    ```

## Configurazione

Assicurati di configurare correttamente le variabili d'ambiente e le impostazioni di AWS CDK prima di eseguire il deployment. Consulta la documentazione per ulteriori dettagli.

## Deployment

* `npm run build-lambdas`   compile lambdas typescript to js
* `npx cdk deploy`  deploy this stack to your default AWS account/region

## Useful commands

* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## Contribuzione

Siamo lieti di accettare contributi da parte della community! Assicurati di leggere le linee guida per la contribuzione prima di inviare una pull request.

## Segnalazione di Problemi

Se incontri problemi o hai suggerimenti per migliorare il progetto, apri un ticket nella sezione delle issue del repository.

## Licenza

Questo progetto è rilasciato sotto la licenza [MIT License](LICENSE).