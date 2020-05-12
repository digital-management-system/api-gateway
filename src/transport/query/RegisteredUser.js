import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

export default class RegisteredUser {
	static singleType = null;
	static connectionDefinitionType = null;

	constructor() {
		RegisteredUser.singleType = new GraphQLObjectType({
			name: 'RegisteredUser',
			fields: () => ({
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				email: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('email') },
			}),
			interfaces: [NodeInterface],
		});
		RegisteredUser.connectionDefinitionType = connectionDefinitions({
			name: 'RegisteredUsers',
			nodeType: RegisteredUser.singleType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of registered users',
				},
			},
		});
	}

	getType = () => RegisteredUser.singleType;

	getConnectionDefinitionType = () => RegisteredUser.connectionDefinitionType;
}
