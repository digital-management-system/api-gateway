import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql';
import { connectionArgs } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';

const getUserFields = () => ({
	id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
	email: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('email') },
});

const getUserType = ({
	getUserFields,
	convertToRelayConnection,
	manufacturerTypeResolver,
	manufacturerBusinessService,
	manufacturerDataLoader,
	registeredUserTypeResolver,
	userBusinessService,
	userDataLoader,
}) =>
	new GraphQLObjectType({
		name: 'User',
		fields: {
			...getUserFields,
			manufacturer: {
				type: manufacturerTypeResolver.getType(),
				args: {
					id: { type: new GraphQLNonNull(GraphQLID) },
				},
				resolve: async (_, { id }) => (id ? manufacturerDataLoader.getManufacturerLoaderById().load(id) : null),
			},
			manufacturers: {
				type: manufacturerTypeResolver.getConnectionDefinitionType().connectionType,
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
				type: registeredUserTypeResolver.getType(),
				args: {
					email: { type: new GraphQLNonNull(GraphQLString) },
				},
				resolve: async (_, { email }) => (email ? userDataLoader.getEmployeeUserTypeLoaderByEmail().load(email) : null),
			},
			registeredUsers: {
				type: registeredUserTypeResolver.getConnectionDefinitionType().connectionType,
				args: {
					...connectionArgs,
					emails: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
					sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
				},
				resolve: async (_, searchCriteria) =>
					convertToRelayConnection(searchCriteria, await userBusinessService.searchEmployee(searchCriteria)),
			},
		},
		interfaces: [NodeInterface],
	});

export { getUserFields, getUserType };
