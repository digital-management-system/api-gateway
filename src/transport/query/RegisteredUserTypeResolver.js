import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import RelayHelper from './RelayHelper';
import Common from './Common';

export default class RegisteredUserTypeResolver {
	constructor({ userBusinessService }) {
		this.userBusinessService = userBusinessService;

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
			name: 'RegisteredUserType',
			nodeType: this.registeredUserType,
		});
	}

	getType = () => this.registeredUserType;

	getConnectionDefinitionType = () => this.registeredUserConnectionType;

	getRegisteredUsers = async (searchArgs) => {
		const { emails } = searchArgs;
		const users = await this.userBusinessService.searchEmployee({ emails });
		const totalCount = users.count();

		if (totalCount === 0) {
			return Common.getEmptyResult();
		}

		const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, totalCount, 10, 1000);

		return Common.convertResultsToRelayConnectionResponse(users, skip, limit, totalCount, hasNextPage, hasPreviousPage);
	};
}
