import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

export default class ActionPointWithoutMSOPTypeResolver {
	constructor({
		employeeDataLoader,
		employeeTypeResolver,
		departmentDataLoader,
		departmentTypeResolver,
		actionPointPriorityTypeResolver,
		actionPointPriorityDataLoader,
		actionPointStatusTypeResolver,
		actionPointStatusDataLoader,
		actionPointReferenceTypeResolver,
		actionPointReferenceDataLoader,
	}) {
		this.actionPointType = new GraphQLObjectType({
			name: 'ActionPointWithoutMSOP',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				assignee: {
					type: employeeTypeResolver.getType(),
					resolve: async (_) => {
						const assigneeId = _.get('assigneeId');

						return assigneeId ? employeeDataLoader.getEmployeeLoaderById().load(assigneeId) : null;
					},
				},
				department: {
					type: new GraphQLNonNull(departmentTypeResolver.getType()),
					resolve: async (_) => departmentDataLoader.getDepartmentLoaderById().load(_.get('departmentId')),
				},
				assignedDate: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('assignedDate') },
				dueDate: { type: GraphQLString, resolve: (_) => _.get('dueDate') },
				priority: {
					type: actionPointPriorityTypeResolver.getType(),
					resolve: async (_) => {
						const priorityId = _.get('priorityId');

						return priorityId ? actionPointPriorityDataLoader.getActionPointPriorityLoaderById().load(priorityId) : null;
					},
				},
				status: {
					type: actionPointStatusTypeResolver.getType(),
					resolve: async (_) => {
						const statusId = _.get('statusId');

						return statusId ? actionPointStatusDataLoader.getActionPointStatusLoaderById().load(statusId) : null;
					},
				},
				references: {
					type: new GraphQLNonNull(new GraphQLList(actionPointReferenceTypeResolver.getType())),
					resolve: async (_) =>
						actionPointReferenceDataLoader.getActionPointReferenceLoaderById().loadMany(_.get('referenceIds').toArray()),
				},
				comments: { type: GraphQLString, resolve: (_) => _.get('comments') },
			},
			interfaces: [NodeInterface],
		});

		this.actionPointConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of action points',
				},
			},
			name: 'ActionPointsWithoutMSOP',
			nodeType: this.actionPointType,
		});
	}

	getType = () => this.actionPointType;

	getConnectionDefinitionType = () => this.actionPointConnectionType;
}
