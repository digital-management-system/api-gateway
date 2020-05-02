import { GraphQLList, GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';

export default class MSOPTypeResolver {
	constructor({
		convertToRelayConnection,
		departmentTypeResolver,
		departmentDataLoader,
		employeeTypeResolver,
		employeeDataLoader,
		meetingFrequencyTypeResolver,
		meetingFrequencyDataLoader,
		meetingDayTypeResolver,
		meetingDayDataLoader,
		meetingDurationTypeResolver,
		meetingDurationDataLoader,
		actionPointWithoutMSOPTypeResolver,
		actionPointBusinessService,
		actionPointDataLoader,
	}) {
		this.msopType = new GraphQLObjectType({
			name: 'MSOP',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				meetingName: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('meetingName') },
				duration: {
					type: new GraphQLNonNull(meetingDurationTypeResolver.getType()),
					resolve: async (_) => meetingDurationDataLoader.getMeetingDurationLoaderById().load(_.get('durationId')),
				},
				frequency: {
					type: new GraphQLNonNull(meetingFrequencyTypeResolver.getType()),
					resolve: async (_) => meetingFrequencyDataLoader.getMeetingFrequencyLoaderById().load(_.get('frequencyId')),
				},
				meetingDays: {
					type: new GraphQLNonNull(new GraphQLList(meetingDayTypeResolver.getType())),
					resolve: async (_) => meetingDayDataLoader.getMeetingDayLoaderById().loadMany(_.get('meetingDayIds').toArray()),
				},
				agendas: { type: GraphQLString, resolve: (_) => _.get('agendas') },
				department: {
					type: new GraphQLNonNull(departmentTypeResolver.getType()),
					resolve: async (_) => departmentDataLoader.getDepartmentLoaderById().load(_.get('departmentId')),
				},
				chairPersonEmployee: {
					type: new GraphQLNonNull(employeeTypeResolver.getType()),
					resolve: async (_) => employeeDataLoader.getEmployeeLoaderById().load(_.get('chairPersonEmployeeId')),
				},
				actionLogSecretaryEmployee: {
					type: new GraphQLNonNull(employeeTypeResolver.getType()),
					resolve: async (_) => employeeDataLoader.getEmployeeLoaderById().load(_.get('actionLogSecretaryEmployeeId')),
				},
				attendees: {
					type: new GraphQLNonNull(new GraphQLList(employeeTypeResolver.getType())),
					resolve: async (_) => employeeDataLoader.getEmployeeLoaderById().loadMany(_.get('attendeeIds').toArray()),
				},
				actionPoint: {
					type: actionPointWithoutMSOPTypeResolver.getType(),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? actionPointDataLoader.getActionPointLoaderById().load(id) : null),
				},
				actionPoints: {
					type: actionPointWithoutMSOPTypeResolver.getConnectionDefinitionType().connectionType,
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
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of MSOPs',
				},
			},
			name: 'MSOPs',
			nodeType: this.msopType,
		});
	}

	getType = () => this.msopType;

	getConnectionDefinitionType = () => this.msopConnectionType;
}
