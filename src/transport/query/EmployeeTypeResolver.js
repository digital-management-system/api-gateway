import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import RelayHelper from './RelayHelper';
import Common from './Common';
import { NodeInterface } from '../interface';

export default class EmployeeTypeResolver {
	constructor({ departmentTypeResolver, departmentDataLoader, employeeBusinessService }) {
		this.departmentTypeResolver = departmentTypeResolver;
		this.employeeBusinessService = employeeBusinessService;

		this.employeeType = new GraphQLObjectType({
			name: 'Employee',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: ({ id }) => id },
				email: { type: new GraphQLNonNull(GraphQLString), resolve: ({ email }) => email },
				employeeReference: { type: new GraphQLNonNull(GraphQLString), resolve: ({ employeeReference }) => employeeReference },
				departments: {
					type: new GraphQLNonNull(new GraphQLList(this.departmentTypeResolver.getType())),
					resolve: async ({ departmentIds }) => {
						if (!departmentIds || departmentIds.length === 0) {
							return [];
						}

						return departmentDataLoader.getDepartmentLoaderById().loadMany(departmentIds);
					},
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

	getEmployees = async (searchArgs) => {
		const { employeeIds } = searchArgs;
		const employees = await this.employeeBusinessService.search({ employeeIds });
		const totalCount = employees.length;

		if (totalCount === 0) {
			return Common.getEmptyResult();
		}

		const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, totalCount, 10, 1000);

		return Common.convertResultsToRelayConnectionResponse(employees, skip, limit, totalCount, hasNextPage, hasPreviousPage);
	};
}
