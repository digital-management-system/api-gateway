import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

const getRegisteredUserFields = () => ({
	id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
	email: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('email') },
});

const getRegisteredUserType = ({ getRegisteredUserFields }) =>
	new GraphQLObjectType({
		name: 'RegisteredUserProperties',
		fields: {
			...getRegisteredUserFields,
		},
		interfaces: [NodeInterface],
	});

const getRegisteredUserConnectionType = ({ getRegisteredUserType }) =>
	connectionDefinitions({
		name: 'RegisteredUsersProperties',
		nodeType: getRegisteredUserType,
		connectionFields: {
			totalCount: {
				type: GraphQLInt,
				description: 'Total number of registered users',
			},
		},
	});

class RegisteredUserTypeResolver {
	constructor({ getRegisteredUserFields }) {
		this.registeredUserType = new GraphQLObjectType({
			name: 'RegisteredUser',
			fields: {
				...getRegisteredUserFields,
			},
			interfaces: [NodeInterface],
		});
		this.registeredUserConnectionType = connectionDefinitions({
			name: 'RegisteredUsers',
			nodeType: this.registeredUserType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of registered users',
				},
			},
		});
	}

	getType = () => this.registeredUserType;

	getConnectionDefinitionType = () => this.registeredUserConnectionType;
}

export { getRegisteredUserFields, getRegisteredUserType, getRegisteredUserConnectionType, RegisteredUserTypeResolver };
