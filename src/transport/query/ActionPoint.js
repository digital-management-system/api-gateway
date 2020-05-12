import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import Manufacturer from './Manufacturer';
import Department from './Department';
import Employee from './Employee';
import ActionPointStatus from './ActionPointStatus';
import ActionPointReference from './ActionPointReference';
import ActionPointPriority from './ActionPointPriority';

export default class ActionPoint {
	static singleType = null;
	static connectionDefinitionType = null;

	constructor({
		manufacturerDataLoader,
		msopDataLoader,
		msop,
		actionPointPriorityDataLoader,
		actionPointStatusDataLoader,
		actionPointReferenceDataLoader,
		employeeDataLoader,
		departmentDataLoader,
	}) {
		ActionPoint.singleType = new GraphQLObjectType({
			name: 'ActionPoint',
			fields: () => ({
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				assignedDate: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('assignedDate') },
				dueDate: { type: GraphQLString, resolve: (_) => _.get('dueDate') },
				comments: { type: GraphQLString, resolve: (_) => _.get('comments') },
				manufacturer: {
					type: new GraphQLNonNull(Manufacturer.singleType),
					resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
				},
				msop: {
					type: msop.getType(),
					resolve: async (_) => {
						const msopId = _.get('msopId');

						return msopId ? msopDataLoader.getMSOPLoaderById().load(msopId) : null;
					},
				},
				assignee: {
					type: Employee.singleType,
					resolve: async (_) => {
						const assigneeId = _.get('assigneeId');

						return assigneeId ? employeeDataLoader.getEmployeeLoaderById().load(assigneeId) : null;
					},
				},
				department: {
					type: new GraphQLNonNull(Department.singleType),
					resolve: async (_) => departmentDataLoader.getDepartmentLoaderById().load(_.get('departmentId')),
				},
				priority: {
					type: ActionPointPriority.singleType,
					resolve: async (_) => {
						const priorityId = _.get('priorityId');

						return priorityId ? actionPointPriorityDataLoader.getActionPointPriorityLoaderById().load(priorityId) : null;
					},
				},
				status: {
					type: ActionPointStatus.singleType,
					resolve: async (_) => {
						const statusId = _.get('statusId');

						return statusId ? actionPointStatusDataLoader.getActionPointStatusLoaderById().load(statusId) : null;
					},
				},
				references: {
					type: new GraphQLNonNull(new GraphQLList(ActionPointReference.singleType)),
					resolve: async (_) =>
						actionPointReferenceDataLoader.getActionPointReferenceLoaderById().loadMany(_.get('referenceIds').toArray()),
				},
			}),
			interfaces: [NodeInterface],
		});

		ActionPoint.connectionDefinitionType = connectionDefinitions({
			name: 'ActionPoints',
			nodeType: ActionPoint.singleType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of action points',
				},
			},
		});
	}

	getType = () => ActionPoint.singleType;

	getConnectionDefinitionType = () => ActionPoint.connectionDefinitionType;
}
