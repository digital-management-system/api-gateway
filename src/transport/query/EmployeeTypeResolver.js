import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import RelayHelper from './RelayHelper';
import Common from './Common';
import { NodeInterface } from '../interface';

export default class EmployeeTypeResolver {
	constructor({
		registeredUserTypeResolver,
		departmentTypeResolver,
		employeeBusinessService,
		userDataLoader,
		departmentDataLoader,
		employeeDataLoader,
		reportingEmployeeTypeResolver,
	}) {
		this.employeeBusinessService = employeeBusinessService;

		this.employeeType = new GraphQLObjectType({
			name: 'Employee',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				employeeReference: { type: GraphQLString, resolve: (_) => _.get('employeeReference') },
				position: { type: GraphQLString, resolve: (_) => _.get('position') },
				mobile: { type: GraphQLString, resolve: (_) => _.get('mobile') },
				user: {
					type: new GraphQLNonNull(registeredUserTypeResolver.getType()),
					resolve: async (_) => userDataLoader.getUserLoaderById().load(_.get('userId')),
				},
				departments: {
					type: new GraphQLNonNull(new GraphQLList(departmentTypeResolver.getType())),
					resolve: async (_) => departmentDataLoader.getDepartmentLoaderById().loadMany(_.get('departmentIds').toArray()),
				},
				reportingToEmployee: {
					type: reportingEmployeeTypeResolver.getType(),
					resolve: async (_) => {
						const reportingToEmployeeId = _.get('reportingToEmployeeId');

						return reportingToEmployeeId ? employeeDataLoader.getEmployeeLoaderById().load(reportingToEmployeeId) : null;
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
