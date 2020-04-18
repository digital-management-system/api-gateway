import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { NodeInterface } from '../interface';

export default new GraphQLObjectType({
	name: 'Department',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: ({ id }) => id },
		name: { type: new GraphQLNonNull(GraphQLString), resolve: ({ name }) => name },
		description: { type: GraphQLString, resolve: ({ description }) => description },
	},
	interfaces: [NodeInterface],
});
