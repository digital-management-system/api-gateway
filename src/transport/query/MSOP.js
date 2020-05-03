import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';

const manufacturerType = new GraphQLObjectType({
	name: 'MSOP_ManufacturerProperties',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
		name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	},
	interfaces: [NodeInterface],
});

const getMSOPFields = ({ manufacturerDataLoader }) => ({
	id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
	meetingName: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('meetingName') },
	agendas: { type: GraphQLString, resolve: (_) => _.get('agendas') },
	manufacturer: {
		type: new GraphQLNonNull(manufacturerType),
		resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
	},
});

const getMSOPType = ({ getMSOPFields }) =>
	new GraphQLObjectType({
		name: 'MSOPProperties',
		fields: {
			...getMSOPFields,
		},
		interfaces: [NodeInterface],
	});

const getMSOPConnectionType = ({ getMSOPType }) =>
	connectionDefinitions({
		name: 'MSOPsProperties',
		nodeType: getMSOPType,
		connectionFields: {
			totalCount: {
				type: GraphQLInt,
				description: 'Total number of MSOPs',
			},
		},
	});

class MSOPTypeResolver {
	constructor({
		getMSOPFields,
		convertToRelayConnection,
		meetingFrequencyDataLoader,
		meetingDayDataLoader,
		meetingDurationDataLoader,
		actionPointBusinessService,
		employeeDataLoader,
		departmentDataLoader,
		getEmployeeType,
		getMeetingDurationType,
		getMeetingFrequencyType,
		getMeetingDayType,
		getActionPointConnectionType,
		getDepartmentType,
	}) {
		const employeeType = getEmployeeType('MSOPTypeResolver_EmployeeProperties');

		this.msopType = new GraphQLObjectType({
			name: 'MSOP',
			fields: {
				...getMSOPFields,
				duration: {
					type: new GraphQLNonNull(getMeetingDurationType),
					resolve: async (_) => meetingDurationDataLoader.getMeetingDurationLoaderById().load(_.get('durationId')),
				},
				frequency: {
					type: new GraphQLNonNull(getMeetingFrequencyType),
					resolve: async (_) => meetingFrequencyDataLoader.getMeetingFrequencyLoaderById().load(_.get('frequencyId')),
				},
				meetingDays: {
					type: new GraphQLNonNull(new GraphQLList(getMeetingDayType)),
					resolve: async (_) => meetingDayDataLoader.getMeetingDayLoaderById().loadMany(_.get('meetingDayIds').toArray()),
				},
				department: {
					type: new GraphQLNonNull(getDepartmentType),
					resolve: async (_) => departmentDataLoader.getDepartmentLoaderById().load(_.get('departmentId')),
				},
				chairPersonEmployee: {
					type: new GraphQLNonNull(employeeType),
					resolve: async (_) => employeeDataLoader.getEmployeeLoaderById().load(_.get('chairPersonEmployeeId')),
				},
				actionLogSecretaryEmployee: {
					type: new GraphQLNonNull(employeeType),
					resolve: async (_) => employeeDataLoader.getEmployeeLoaderById().load(_.get('actionLogSecretaryEmployeeId')),
				},
				attendees: {
					type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(employeeType))),
					resolve: async (_) => employeeDataLoader.getEmployeeLoaderById().loadMany(_.get('attendeeIds').toArray()),
				},
				actionPoints: {
					type: getActionPointConnectionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						assigneeId: { type: GraphQLID },
						departmentId: { type: GraphQLID },
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
							await actionPointBusinessService.search(Object.assign(searchCriteria, { msopId: _.get('id') }))
						),
				},
			},
			interfaces: [NodeInterface],
		});
		this.msopConnectionType = connectionDefinitions({
			name: 'MSOPs',
			nodeType: this.msopType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of MSOPs',
				},
			},
		});
	}

	getType = () => this.msopType;

	getConnectionDefinitionType = () => this.msopConnectionType;
}

export { getMSOPFields, getMSOPType, getMSOPConnectionType, MSOPTypeResolver };
