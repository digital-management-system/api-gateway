import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

export default class EmployeeWithoutDepartmentTypeResolver {
	constructor({ registeredUserTypeResolver, userDataLoader, employeeDataLoader, reportingEmployeeTypeResolver }) {
		this.employeeType = new GraphQLObjectType({
			name: 'EmployeeWithoutDepartment',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				employeeReference: { type: GraphQLString, resolve: (_) => _.get('employeeReference') },
				position: { type: GraphQLString, resolve: (_) => _.get('position') },
				mobile: { type: GraphQLString, resolve: (_) => _.get('mobile') },
				user: {
					type: new GraphQLNonNull(registeredUserTypeResolver.getType()),
					resolve: async (_) => userDataLoader.getUserLoaderById().load(_.get('userId')),
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
			name: 'EmployeesWithoutDepartment',
			nodeType: this.employeeType,
		});
	}

	getType = () => this.employeeType;

	getConnectionDefinitionType = () => this.employeeConnectionType;
}
