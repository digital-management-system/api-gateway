import { GraphQLObjectType } from 'graphql';

const getRootQuery = ({ getUserType, userBusinessService, decodedSessionToken }) =>
	new GraphQLObjectType({
		name: 'Query',
		fields: {
			user: { type: getUserType, resolve: async () => userBusinessService.read(decodedSessionToken.user_id) },
		},
	});

export default getRootQuery;
