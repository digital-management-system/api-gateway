import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

export default new GraphQLObjectType({
	name: 'Name',
	fields: {
		firstName: { type: new GraphQLNonNull(GraphQLString), resolve: ({ firstName }) => firstName },
		middleName: { type: GraphQLString, resolve: ({ middleName }) => middleName },
		lastName: { type: new GraphQLNonNull(GraphQLString), resolve: ({ lastName }) => lastName },
		preferredName: { type: GraphQLString, resolve: ({ preferredName }) => preferredName },
	},
});
