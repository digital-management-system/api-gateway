import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import GraphQLHTTP from 'express-graphql';
import getRootSchema from './RootSchema';

export const graphqlServer = express();

const schema = getRootSchema();

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
		},
	})(request, response);
});
