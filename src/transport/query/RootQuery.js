import { GraphQLObjectType } from 'graphql';

import User from './User';

const getRootQuery = ({ userBusinessService, decodedSessionToken }) =>
	new GraphQLObjectType({
		name: 'Query',
		fields: () => ({
			user: { type: User.singleType, resolve: async () => userBusinessService.read(decodedSessionToken.user_id) },
		}),
	});

export default getRootQuery;
