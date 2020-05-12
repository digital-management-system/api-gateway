import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';
import Manufacturer from './Manufacturer';
import Department from './Department';
import Employee from './Employee';
import MeetingDuration from './MeetingDuration';
import MeetingDay from './MeetingDay';
import MeetingFrequency from './MeetingFrequency';
import ActionPoint from './ActionPoint';

export default class MSOP {
	static singleType = null;
	static connectionDefinitionType = null;

	constructor({
		convertToRelayConnection,
		meetingFrequencyDataLoader,
		meetingDayDataLoader,
		meetingDurationDataLoader,
		actionPointBusinessService,
		employeeDataLoader,
		departmentDataLoader,
		manufacturerDataLoader,
	}) {
		MSOP.singleType = new GraphQLObjectType({
			name: 'MSOP',
			fields: () => ({
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				meetingName: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('meetingName') },
				agendas: { type: GraphQLString, resolve: (_) => _.get('agendas') },
				manufacturer: {
					type: new GraphQLNonNull(Manufacturer.singleType),
					resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
				},
				duration: {
					type: new GraphQLNonNull(MeetingDuration.singleType),
					resolve: async (_) => meetingDurationDataLoader.getMeetingDurationLoaderById().load(_.get('durationId')),
				},
				frequency: {
					type: new GraphQLNonNull(MeetingFrequency.singleType),
					resolve: async (_) => meetingFrequencyDataLoader.getMeetingFrequencyLoaderById().load(_.get('frequencyId')),
				},
				meetingDays: {
					type: new GraphQLNonNull(new GraphQLList(MeetingDay.singleType)),
					resolve: async (_) => meetingDayDataLoader.getMeetingDayLoaderById().loadMany(_.get('meetingDayIds').toArray()),
				},
				department: {
					type: new GraphQLNonNull(Department.singleType),
					resolve: async (_) => departmentDataLoader.getDepartmentLoaderById().load(_.get('departmentId')),
				},
				chairPersonEmployee: {
					type: new GraphQLNonNull(Employee.singleType),
					resolve: async (_) => employeeDataLoader.getEmployeeLoaderById().load(_.get('chairPersonEmployeeId')),
				},
				actionLogSecretaryEmployee: {
					type: new GraphQLNonNull(Employee.singleType),
					resolve: async (_) => employeeDataLoader.getEmployeeLoaderById().load(_.get('actionLogSecretaryEmployeeId')),
				},
				attendees: {
					type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Employee.singleType))),
					resolve: async (_) => employeeDataLoader.getEmployeeLoaderById().loadMany(_.get('attendeeIds').toArray()),
				},
				actionPoints: {
					type: ActionPoint.connectionDefinitionType.connectionType,
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
			}),
			interfaces: [NodeInterface],
		});
		MSOP.connectionDefinitionType = connectionDefinitions({
			name: 'MSOPs',
			nodeType: MSOP.singleType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of MSOPs',
				},
			},
		});
	}

	getType = () => MSOP.singleType;

	getConnectionDefinitionType = () => MSOP.connectionDefinitionType;
}
