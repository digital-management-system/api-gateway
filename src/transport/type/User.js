import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';

const getUserType = ({ departmentResolver, employeeResolver }) =>
	new GraphQLObjectType({
		name: 'User',
		fields: {
			id: { type: new GraphQLNonNull(GraphQLID), resolve: ({ id }) => id },
			department: {
				type: departmentResolver.getType(),
				args: {
					departmentId: { type: new GraphQLNonNull(GraphQLID) },
				},
				resolve: async (_, { departmentId }, { dataLoaders: { departmentLoaderById } }) =>
					departmentId ? departmentLoaderById.load(departmentId) : null,
			},
			departments: {
				type: departmentResolver.getConnectionDefinitionType().connectionType,
				args: {
					...connectionArgs,
					departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
					sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
				},
				resolve: async (_, searchArgs, { dataLoaders }) => departmentResolver.getDepartments(searchArgs, dataLoaders),
			},
			employee: {
				type: employeeResolver.getType(),
				args: {
					employeeId: { type: new GraphQLNonNull(GraphQLID) },
				},
				resolve: async (_, { employeeId }, { dataLoaders: { employeeLoaderById } }) =>
					employeeId ? employeeLoaderById.load(employeeId) : null,
			},
			employees: {
				type: employeeResolver.getConnectionDefinitionType().connectionType,
				args: {
					...connectionArgs,
					employeeIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
					sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
				},
				resolve: async (_, searchArgs, { dataLoaders }) => employeeResolver.getEmployees(searchArgs, dataLoaders),
			},
		},
		interfaces: [NodeInterface],
	});

export default getUserType;
