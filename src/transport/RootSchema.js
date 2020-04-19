import { GraphQLSchema } from 'graphql';

const getRootSchema = ({ getRootQuery, getRootMutation }) =>
	new GraphQLSchema({
		query: getRootQuery,
		mutation: getRootMutation,
	});

export default getRootSchema;
