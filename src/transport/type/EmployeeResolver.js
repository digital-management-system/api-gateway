import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { connectionArgs } from 'graphql-relay';
import RelayHelper from './RelayHelper';
import Common from './Common';
import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';
import Name from './Name';

export default class EmployeeResolver {
	constructor({ departmentResolver }) {
		this.departmentResolver = departmentResolver;
		this.employeeType = new GraphQLObjectType({
			name: 'Employee',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: ({ id }) => id },
				name: { type: new GraphQLNonNull(Name), resolve: ({ name }) => name },
				departments: {
					type: this.departmentResolver.getConnectionDefinitionType().connectionType,
					args: {
						...connectionArgs,
						departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchArgs, { dataLoaders }) => this.departmentResolver.getDepartments(searchArgs, dataLoaders),
				},
			},
			interfaces: [NodeInterface],
		});
		this.employeeConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of employees',
				},
			},
			name: 'EmployeeType',
			nodeType: this.employeeType,
		});
	}

	getType = () => this.employeeType;

	getConnectionDefinitionType = () => this.employeeConnectionType;

	getEmployees = async (searchArgs, { employeeLoaderById }) => {
		const { employeeIds } = searchArgs;

		if (!employeeIds || employeeIds.length === 0) {
			return Common.getEmptyResult();
		}

		const employees = await employeeLoaderById.loadMany(employeeIds);
		const totalCount = employees.length;

		if (totalCount === 0) {
			return Common.getEmptyResult();
		}

		const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, totalCount, 10, 1000);

		return Common.convertResultsToRelayConnectionResponse(employees, skip, limit, totalCount, hasNextPage, hasPreviousPage);
	};
}
