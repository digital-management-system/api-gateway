import { GraphQLSchema } from 'graphql';
import { RootQuery } from './type';

export default function getRootSchema() {
	return new GraphQLSchema({
		query: RootQuery,
	});
}
