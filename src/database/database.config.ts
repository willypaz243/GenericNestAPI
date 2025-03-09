import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const getTypeOrmConfig: () => DataSourceOptions = () => {
  const typeOrmConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.MYSQL_HOST || 'localhost',
    port: 5432,
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'agents_db',
    entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*.ts'],
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
  };
  return typeOrmConfig;
};

const getDataSource = () => {
  config({ path: '.env' });

  const dataSource = new DataSource({ ...getTypeOrmConfig() });
  return dataSource;
};

export default getDataSource();
