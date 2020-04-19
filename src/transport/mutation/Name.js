import { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

export default new GraphQLInputObjectType({
	name: 'InputName',
	fields: {
		firstName: { type: new GraphQLNonNull(GraphQLString) },
		middleName: { type: GraphQLString },
		lastName: { type: new GraphQLNonNull(GraphQLString) },
		preferredName: { type: GraphQLString },
	},
});
