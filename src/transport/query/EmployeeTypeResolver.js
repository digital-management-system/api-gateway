import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

export default class EmployeeTypeResolver {
	constructor({
		registeredUserTypeResolver,
		userDataLoader,
		employeeDataLoader,
		reportingEmployeeTypeResolver,
		departmentTypeResolver,
		departmentDataLoader,
	}) {
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
			name: 'Employees',
			nodeType: this.employeeType,
		});
	}

	getType = () => this.employeeType;

	getConnectionDefinitionType = () => this.employeeConnectionType;
}
