import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import GraphQLHTTP from 'express-graphql';
import cors from 'cors';
import getRootSchema from './RootSchema';
import { createDepartmentLoaderById, createEmployeeLoaderById } from './loaders';

export const graphqlServer = express();

const schema = getRootSchema();

graphqlServer.use(cors());
graphqlServer.use('*', async (request, response) => {
	return GraphQLHTTP({
		schema,
		customFormatErrorFn: (error) => {
			return {
				message: error.message,
				locations: error.locations,
				stack: error.stack ? error.stack.split('\n') : [],
				path: error.path,
			};
		},
		graphiql: true,
		context: {
			request,
			sessionToken: request.headers.authorization,
			dataLoaders: {
				departmentLoaderById: createDepartmentLoaderById(),
				employeeLoaderById: createEmployeeLoaderById(),
			},
		},
	})(request, response);
});

export { getRootSchema };
