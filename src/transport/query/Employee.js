import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';
import RegisteredUser from './RegisteredUser';
import Manufacturer from './Manufacturer';
import Department from './Department';
import ActionPoint from './ActionPoint';

export default class Employee {
	static singleType = null;
	static connectionDefinitionType = null;

	constructor({
		convertToRelayConnection,
		userDataLoader,
		manufacturerDataLoader,
		departmentDataLoader,
		actionPointBusinessService,
		employeeDataLoader,
	}) {
		Employee.singleType = new GraphQLObjectType({
			name: 'Employee',
			fields: () => ({
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				employeeReference: { type: GraphQLString, resolve: (_) => _.get('employeeReference') },
				position: { type: GraphQLString, resolve: (_) => _.get('position') },
				mobile: { type: GraphQLString, resolve: (_) => _.get('mobile') },
				user: {
					type: new GraphQLNonNull(RegisteredUser.singleType),
					resolve: async (_) => userDataLoader.getUserLoaderById().load(_.get('userId')),
				},
				manufacturer: {
					type: new GraphQLNonNull(Manufacturer.singleType),
					resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
				},
				departments: {
					type: new GraphQLNonNull(new GraphQLList(Department.singleType)),
					resolve: async (_) => departmentDataLoader.getDepartmentLoaderById().loadMany(_.get('departmentIds').toArray()),
				},
				actionPoints: {
					type: ActionPoint.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						departmentId: { type: GraphQLID },
						msopId: { type: GraphQLID },
						assignedDate: { type: GraphQLString },
						dueDate: { type: GraphQLString },
						priorityId: { type: GraphQLID },
						statusId: { type: GraphQLID },
						referenceId: { type: GraphQLID },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await actionPointBusinessService.search(Object.assign(searchCriteria, { assigneeId: _.get('id') }))
						),
				},
				reportingToEmployee: {
					type: Employee.singleType,
					resolve: async (_) => {
						const reportingToEmployeeId = _.get('reportingToEmployeeId');

						return reportingToEmployeeId ? employeeDataLoader.getEmployeeLoaderById().load(reportingToEmployeeId) : null;
					},
				},
			}),
			interfaces: [NodeInterface],
		});
		Employee.connectionDefinitionType = connectionDefinitions({
			name: 'Employees',
			nodeType: Employee.singleType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of employees',
				},
			},
		});
	}

	getType = () => Employee.singleType;

	getConnectionDefinitionType = () => Employee.connectionDefinitionType;
}
