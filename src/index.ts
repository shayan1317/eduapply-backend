import {juggler} from '@loopback/repository';
import {ApplicationConfig, EduApplyApplication} from './application';
import {AwsService} from './services';
import {Secrets} from './types';

export * from './application';

const AWS_SECRETS_NAME = process.env.AWS_SECRETS_NAME ?? '';
const DB_NAME = process.env.DB_NAME;

async function createDatasource(): Promise<juggler.DataSource> {
  try {
    const awsService = new AwsService();
    const secrets: Secrets = await awsService.getSecrets(AWS_SECRETS_NAME);
    const dsName = 'postgres';
    const dsConfig = {
      name: dsName,
      password: secrets.DB_PASSWORD,
      user: secrets.DB_USERNAME,
      database: DB_NAME,
      port: secrets.DB_PORT,
      host: secrets.DB_HOST,
      connector: require('loopback-connector-postgresql'),
      url: `postgres://${secrets.DB_USERNAME}:${secrets.DB_PASSWORD}@${secrets.DB_HOST}:${secrets.DB_PORT}/${DB_NAME}`,
      uri: `postgres://${secrets.DB_USERNAME}:${secrets.DB_PASSWORD}@${secrets.DB_HOST}:${secrets.DB_PORT}/${DB_NAME}`,
    };
    const prodDs = new juggler.DataSource(dsConfig);
    return prodDs;
  } catch (error) {
    throw error;
  }
}

export async function main(options: ApplicationConfig = {}) {
  const app = new EduApplyApplication(options);
  await app.boot();
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'development'
  ) {
    console.log('in if');
    const prodDatasource = await createDatasource();
    app.dataSource(prodDatasource);
  }
  await app.migrateSchema({existingSchema: 'alter'});
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 4000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.log('MainError', err);
    process.exit(1);
  });
}
