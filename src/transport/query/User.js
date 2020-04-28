import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql';
import { connectionArgs } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';

const getUserType = ({ manufacturerTypeResolver, manufacturerDataLoader, registeredUserTypeResolver, userDataLoader }) =>
	new GraphQLObjectType({
		name: 'User',
		fields: {
			id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
			email: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('email') },
			manufacturer: {
				type: manufacturerTypeResolver.getType(),
				args: {
					manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
				},
				resolve: async (_, { manufacturerId }) =>
					manufacturerId ? manufacturerDataLoader.getManufacturerLoaderById().load(manufacturerId) : null,
			},
			manufacturers: {
				type: manufacturerTypeResolver.getConnectionDefinitionType().connectionType,
				args: {
					...connectionArgs,
					manufacturerIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
					sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
				},
				resolve: async (_, searchArgs) => manufacturerTypeResolver.getManufacturers(searchArgs),
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
				resolve: async (_, searchArgs) => registeredUserTypeResolver.getRegisteredUsers(searchArgs),
			},
		},
		interfaces: [NodeInterface],
	});

export default getUserType;
