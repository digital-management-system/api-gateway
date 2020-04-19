import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';

const getUserType = ({ departmentTypeResolver, employeeTypeResolver, departmentLoaderById, employeeLoaderById }) =>
	new GraphQLObjectType({
		name: 'User',
		fields: {
			id: { type: new GraphQLNonNull(GraphQLID), resolve: ({ id }) => id },
			department: {
				type: departmentTypeResolver.getType(),
				args: {
					departmentId: { type: new GraphQLNonNull(GraphQLID) },
				},
				resolve: async (_, { departmentId }) => (departmentId ? departmentLoaderById.load(departmentId) : null),
			},
			departments: {
				type: departmentTypeResolver.getConnectionDefinitionType().connectionType,
				args: {
					...connectionArgs,
					departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
					sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
				},
				resolve: async (_, searchArgs, { dataLoaders }) => departmentTypeResolver.getDepartments(searchArgs, dataLoaders),
			},
			employee: {
				type: employeeTypeResolver.getType(),
				args: {
					employeeId: { type: new GraphQLNonNull(GraphQLID) },
				},
				resolve: async (_, { employeeId }) => (employeeId ? employeeLoaderById.load(employeeId) : null),
			},
			employees: {
				type: employeeTypeResolver.getConnectionDefinitionType().connectionType,
				args: {
					...connectionArgs,
					employeeIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
					sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
				},
				resolve: async (_, searchArgs, { dataLoaders }) => employeeTypeResolver.getEmployees(searchArgs, dataLoaders),
			},
		},
		interfaces: [NodeInterface],
	});

export default getUserType;
