import fs from 'fs';
import path from 'path';
import { graphql, printSchema } from 'graphql';
import { introspectionQuery } from 'graphql/utilities';
import { setupContainer } from '../src';

const getRootSchema = setupContainer().resolve('getRootSchema');

fs.writeFileSync(path.resolve(__dirname, '../schema/schema.graphql'), printSchema(getRootSchema));

graphql(getRootSchema, introspectionQuery)
  .then((json) => {
    fs.writeFileSync(path.resolve(__dirname, '../schema/schema.json'), JSON.stringify(json, null, 2));
    console.log('Done');
  })
  .catch(error => console.log(`Failed. Error: ${error}`));
