import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import RelayHelper from './RelayHelper';
import Common from './Common';

export default class ActionPointTypeResolver {
	constructor({
		actionPointBusinessService,
		msopDataLoader,
		msopTypeResolver,
		employeeDataLoader,
		employeeTypeResolver,
		departmentDataLoader,
		departmentTypeResolver,
		actionReferenceTypeResolver,
		actionReferenceDataLoader,
	}) {
		this.actionPointBusinessService = actionPointBusinessService;

		this.actionPointType = new GraphQLObjectType({
			name: 'ActionPoint',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				msop: {
					type: msopTypeResolver.getType(),
					resolve: async (_) => {
						const msopId = _.get('msopId');

						return msopId ? msopDataLoader.getMSOPLoaderById().load(msopId) : null;
					},
				},
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
				priority: { type: GraphQLString, resolve: (_) => _.get('priority') },
				status: { type: GraphQLString, resolve: (_) => _.get('status') },
				actionReferences: {
					type: new GraphQLNonNull(new GraphQLList(actionReferenceTypeResolver.getType())),
					resolve: async (_) => actionReferenceDataLoader.getActionReferenceLoaderById().loadMany(_.get('actionReferenceIds').toArray()),
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
			name: 'ActionPointType',
			nodeType: this.actionPointType,
		});
	}

	getType = () => this.actionPointType;

	getConnectionDefinitionType = () => this.actionPointConnectionType;

	getActionPoints = async (searchArgs) => {
		const { actionPointIds } = searchArgs;
		const actionPoints = await this.actionPointBusinessService.search({ actionPointIds });
		const totalCount = actionPoints.length;

		if (totalCount === 0) {
			return Common.getEmptyResult();
		}

		const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, totalCount, 10, 1000);

		return Common.convertResultsToRelayConnectionResponse(actionPoints, skip, limit, totalCount, hasNextPage, hasPreviousPage);
	};
}
