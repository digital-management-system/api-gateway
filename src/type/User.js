import { GraphQLID, GraphQLObjectType, GraphQLNonNull } from 'graphql';
import { NodeInterface } from '../interface';

export default new GraphQLObjectType({
	name: 'User',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: () => 'User ID' },
	},
	interfaces: [NodeInterface],
});
