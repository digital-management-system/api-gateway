import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';

const getUserType = ({
	departmentTypeResolver,
	registeredUserTypeResolver,
	employeeTypeResolver,
	departmentDataLoader,
	userDataLoader,
	employeeDataLoader,
}) =>
	new GraphQLObjectType({
		name: 'User',
		fields: {
			id: { type: new GraphQLNonNull(GraphQLID), resolve: ({ id }) => id },
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
		},
		interfaces: [NodeInterface],
	});

export default getUserType;
