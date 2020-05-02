import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

export default class RegisteredUserTypeResolver {
	constructor() {
		this.registeredUserType = new GraphQLObjectType({
			name: 'RegisteredUser',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				email: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('email') },
			},
			interfaces: [NodeInterface],
		});
		this.registeredUserConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of registeredUsers',
				},
			},
			name: 'RegisteredUsers',
			nodeType: this.registeredUserType,
		});
	}

	getType = () => this.registeredUserType;

	getConnectionDefinitionType = () => this.registeredUserConnectionType;
}
