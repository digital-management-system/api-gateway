import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

export default new GraphQLObjectType({
	name: 'Name',
	fields: {
		firstName: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('firstName') },
		middleName: { type: GraphQLString, resolve: (_) => _.get('middleName') },
		lastName: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('lastName') },
		preferredName: { type: GraphQLString, resolve: (_) => _.get('preferredName') },
	},
});
