import {juggler} from '@loopback/repository';
import {ApplicationConfig, EduApplyApplication} from './application';

export * from './application';

const DB_NAME = process.env.DB_NAME;

async function createDatasource(): Promise<juggler.DataSource> {
  try {
    const dsName = 'postgres';
    const dsConfig = {
      name: dsName,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: +(process.env.DB_PORT ?? 5432),
      host: process.env.DB_HOST,
      connector: require('loopback-connector-postgresql'),
      url: process.env.DB_URI,
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
