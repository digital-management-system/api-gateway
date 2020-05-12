import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql';
import { connectionArgs } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';
import Manufacturer from './Manufacturer';
import RegisteredUser from './RegisteredUser';

export default class User {
	static singleType = null;

	constructor({ convertToRelayConnection, manufacturerBusinessService, manufacturerDataLoader, userBusinessService, userDataLoader }) {
		User.singleType = new GraphQLObjectType({
			name: 'User',
			fields: () => ({
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				email: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('email') },
				manufacturer: {
					type: Manufacturer.singleType,
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? manufacturerDataLoader.getManufacturerLoaderById().load(id) : null),
				},
				manufacturers: {
					type: Manufacturer.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						name: { type: GraphQLString },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await manufacturerBusinessService.search(Object.assign(searchCriteria, { userId: _.get('id') }))
						),
				},
				registeredUser: {
					type: RegisteredUser.singleType,
					args: {
						email: { type: new GraphQLNonNull(GraphQLString) },
					},
					resolve: async (_, { email }) => (email ? userDataLoader.getEmployeeUserTypeLoaderByEmail().load(email) : null),
				},
				registeredUsers: {
					type: RegisteredUser.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						emails: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(searchCriteria, await userBusinessService.searchEmployee(searchCriteria)),
				},
			}),
			interfaces: [NodeInterface],
		});
	}

	getType = () => User.singleType;
}
