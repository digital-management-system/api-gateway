import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

const manufacturerType = new GraphQLObjectType({
	name: 'ActionPoint_ManufacturerProperties',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
		name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	},
	interfaces: [NodeInterface],
});

const getActionPointFields = ({ manufacturerDataLoader }) => ({
	id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
	assignedDate: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('assignedDate') },
	dueDate: { type: GraphQLString, resolve: (_) => _.get('dueDate') },
	comments: { type: GraphQLString, resolve: (_) => _.get('comments') },
	manufacturer: {
		type: new GraphQLNonNull(manufacturerType),
		resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
	},
});

const getActionPointType = ({ getActionPointFields }) =>
	new GraphQLObjectType({
		name: 'ActionPointProperties',
		fields: {
			...getActionPointFields,
		},
		interfaces: [NodeInterface],
	});

const getActionPointConnectionType = ({ getActionPointType }) =>
	connectionDefinitions({
		name: 'ActionPointsProperties',
		nodeType: getActionPointType,
		connectionFields: {
			totalCount: {
				type: GraphQLInt,
				description: 'Total number of action points',
			},
		},
	});

class ActionPointTypeResolver {
	constructor({
		getActionPointFields,
		msopDataLoader,
		msopTypeResolver,
		actionPointPriorityDataLoader,
		actionPointStatusDataLoader,
		actionPointReferenceDataLoader,
		employeeDataLoader,
		departmentDataLoader,
		getEmployeeType,
		getActionPointPriorityType,
		getActionPointReferenceType,
		getActionPointStatusType,
		getDepartmentType,
	}) {
		this.actionPointType = new GraphQLObjectType({
			name: 'ActionPoint',
			fields: {
				...getActionPointFields,
				msop: {
					type: msopTypeResolver.getType(),
					resolve: async (_) => {
						const msopId = _.get('msopId');

						return msopId ? msopDataLoader.getMSOPLoaderById().load(msopId) : null;
					},
				},
				assignee: {
					type: getEmployeeType('ActionPointTypeResolver_EmployeeProperties'),
					resolve: async (_) => {
						const assigneeId = _.get('assigneeId');

						return assigneeId ? employeeDataLoader.getEmployeeLoaderById().load(assigneeId) : null;
					},
				},
				department: {
					type: new GraphQLNonNull(getDepartmentType),
					resolve: async (_) => departmentDataLoader.getDepartmentLoaderById().load(_.get('departmentId')),
				},
				priority: {
					type: getActionPointPriorityType,
					resolve: async (_) => {
						const priorityId = _.get('priorityId');

						return priorityId ? actionPointPriorityDataLoader.getActionPointPriorityLoaderById().load(priorityId) : null;
					},
				},
				status: {
					type: getActionPointStatusType,
					resolve: async (_) => {
						const statusId = _.get('statusId');

						return statusId ? actionPointStatusDataLoader.getActionPointStatusLoaderById().load(statusId) : null;
					},
				},
				references: {
					type: new GraphQLNonNull(new GraphQLList(getActionPointReferenceType)),
					resolve: async (_) =>
						actionPointReferenceDataLoader.getActionPointReferenceLoaderById().loadMany(_.get('referenceIds').toArray()),
				},
			},
			interfaces: [NodeInterface],
		});

		this.actionPointConnectionType = connectionDefinitions({
			name: 'ActionPoints',
			nodeType: this.actionPointType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of action points',
				},
			},
		});
	}

	getType = () => this.actionPointType;

	getConnectionDefinitionType = () => this.actionPointConnectionType;
}

export { getActionPointFields, getActionPointType, getActionPointConnectionType, ActionPointTypeResolver };
