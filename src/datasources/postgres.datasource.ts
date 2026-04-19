import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'postgres',
  connector: 'postgresql',
  url:
    process.env.DB_URI ?? 'postgres://postgres:123456@localhost:5432/EDUAPPLY',
  host: process.env.DB_HOST ?? 'localhost',
  password: process.env.DB_PASSWORD ?? '123456',
  // doersDevServerConfigs
  // url: 'postgres://postgres:NjUycbY67iY62z@dev-databases.chwxmrjifkep.us-east-2.rds.amazonaws.com:5432/EDUAPPLY',
  // host: 'dev-databases.chwxmrjifkep.us-east-2.rds.amazonaws.com',
  // password: 'NjUycbY67iY62z',
  port: process.env.DB_PORT ?? 5432,
  user: process.env.DB_USER ?? 'postgres',
  database: process.env.DB_NAME ?? 'EDUAPPLY',
};

@lifeCycleObserver('datasource')
export class PostgresDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'postgres';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.postgres', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
