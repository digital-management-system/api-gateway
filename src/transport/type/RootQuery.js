import { GraphQLObjectType } from 'graphql';

const getRootQuery = ({ getUserType, userBusinessService }) =>
	new GraphQLObjectType({
		name: 'Query',
		fields: {
			user: { type: getUserType, resolve: async () => userBusinessService.get() },
		},
	});

export default getRootQuery;
