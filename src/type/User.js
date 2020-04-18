import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';
import Department from './Department';
import DepartmentConnection, { getDepartments } from './DepartmentConnection';
import Employee from './Employee';
import EmployeeConnection, { getEmployees } from './EmployeeConnection';

export default new GraphQLObjectType({
	name: 'User',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: ({ id }) => id },
		department: {
			type: Department,
			args: {
				departmentId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: async (_, { departmentId }, { dataLoaders: { departmentLoaderById } }) =>
				departmentId ? departmentLoaderById.load(departmentId) : null,
		},
		departments: {
			type: DepartmentConnection.connectionType,
			args: {
				...connectionArgs,
				departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
				sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
			},
			resolve: async (_, searchArgs, { dataLoaders }) => getDepartments(searchArgs, dataLoaders),
		},
		employee: {
			type: Employee,
			args: {
				employeeId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: async (_, { employeeId }, { dataLoaders: { employeeLoaderById } }) => (employeeId ? employeeLoaderById.load(employeeId) : null),
		},
		employees: {
			type: EmployeeConnection.connectionType,
			args: {
				...connectionArgs,
				employeeIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
				sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
			},
			resolve: async (_, searchArgs, { dataLoaders }) => getEmployees(searchArgs, dataLoaders),
		},
	},
	interfaces: [NodeInterface],
});
