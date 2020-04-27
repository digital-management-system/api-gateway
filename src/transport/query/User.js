import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql';
import { connectionArgs } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';
import MSOPMeetingFrequency from './MSOPMeetingFrequency';
import MSOPMeetingDay from './MSOPMeetingDay';

const getUserType = ({
	manufacturerTypeResolver,
	manufacturerDataLoader,
	departmentTypeResolver,
	departmentDataLoader,
	employeeTypeResolver,
	employeeDataLoader,
	registeredUserTypeResolver,
	userDataLoader,
	msopTypeResolver,
	msopDataLoader,
}) =>
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
			department: {
				type: departmentTypeResolver.getType(),
				args: {
					departmentId: { type: new GraphQLNonNull(GraphQLID) },
				},
				resolve: async (_, { departmentId }) => (departmentId ? departmentDataLoader.getDepartmentLoaderById().load(departmentId) : null),
			},
			departments: {
				type: departmentTypeResolver.getConnectionDefinitionType().connectionType,
				args: {
					...connectionArgs,
					departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
					sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
				},
				resolve: async (_, searchArgs) => departmentTypeResolver.getDepartments(searchArgs),
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
			employee: {
				type: employeeTypeResolver.getType(),
				args: {
					employeeId: { type: new GraphQLNonNull(GraphQLID) },
				},
				resolve: async (_, { employeeId }) => (employeeId ? employeeDataLoader.getEmployeeLoaderById().load(employeeId) : null),
			},
			employees: {
				type: employeeTypeResolver.getConnectionDefinitionType().connectionType,
				args: {
					...connectionArgs,
					employeeIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
					sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
				},
				resolve: async (_, searchArgs) => employeeTypeResolver.getEmployees(searchArgs),
			},
			msop: {
				type: msopTypeResolver.getType(),
				args: {
					msopId: { type: new GraphQLNonNull(GraphQLID) },
				},
				resolve: async (_, { msopId }) => (msopId ? msopDataLoader.getMSOPLoaderById().load(msopId) : null),
			},
			msops: {
				type: msopTypeResolver.getConnectionDefinitionType().connectionType,
				args: {
					...connectionArgs,
					msopIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
					sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
				},
				resolve: async (_, searchArgs) => msopTypeResolver.getMSOPs(searchArgs),
			},
			msopMeetingFrequencies: {
				type: new GraphQLList(MSOPMeetingFrequency),
				resolve: () => [0, 1, 2],
			},
			msopMeetingDays: {
				type: new GraphQLList(MSOPMeetingDay),
				resolve: () => [0, 1, 2, 3, 4, 5, 6],
			},
		},
		interfaces: [NodeInterface],
	});

export default getUserType;
