import { GraphQLSchema } from 'graphql';
import { RootQuery } from './type';
import { RootMutation } from './mutation';

const getRootSchema = () =>
	new GraphQLSchema({
		query: RootQuery,
		mutation: RootMutation,
	});

export default getRootSchema;
