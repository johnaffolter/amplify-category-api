import { $TSContext } from '@aws-amplify/amplify-cli-core';
import { printer } from '@aws-amplify/amplify-prompts';
import * as path from 'path';
import fs from 'fs-extra';
import { importAppSyncAPIWalkthrough, writeDefaultGraphQLSchema } from '../../provider-utils/awscloudformation/service-walkthroughs/import-appsync-api-walkthrough';
import { RDS_SCHEMA_FILE_NAME } from '@aws-amplify/graphql-transformer-core';
import { getAPIResourceDir } from '../../provider-utils/awscloudformation/utils/amplify-meta-utils';
import { writeSchemaFile, generateRDSSchema } from '../../provider-utils/awscloudformation/utils/graphql-schema-utils';

const subcommand = 'import';

export const name = subcommand;

export const run = async (context: $TSContext) => {

  // Disable the command for now
  throw new Error("This command has been disabled.");
  
  const importAppSyncAPIWalkInputs = await importAppSyncAPIWalkthrough(context);

  if (importAppSyncAPIWalkInputs?.dataSourceConfig) {
    // ensure imported API resource artifacts are created
    const apiResourceDir = getAPIResourceDir(importAppSyncAPIWalkInputs.apiName);
    fs.ensureDirSync(apiResourceDir);

    const pathToSchemaFile = path.join(apiResourceDir, RDS_SCHEMA_FILE_NAME);
    const schemaString = await generateRDSSchema(context, importAppSyncAPIWalkInputs.dataSourceConfig, pathToSchemaFile);
    writeSchemaFile(pathToSchemaFile, schemaString);

    // print next steps
    printer.info(`Successfully imported the database schema into ${pathToSchemaFile}.`);
  }
};
