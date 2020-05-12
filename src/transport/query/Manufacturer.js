import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';
import RegisteredUser from './RegisteredUser';
import Department from './Department';
import Employee from './Employee';
import ActionPoint from './ActionPoint';
import ActionPointPriority from './ActionPointPriority';
import ActionPointReference from './ActionPointReference';
import ActionPointStatus from './ActionPointStatus';
import MeetingDuration from './MeetingDuration';
import MeetingDay from './MeetingDay';
import MeetingFrequency from './MeetingFrequency';
import MSOP from './MSOP';

export default class Manufacturer {
	static singleType = null;
	static connectionDefinitionType = null;

	constructor({
		convertToRelayConnection,
		userDataLoader,

		departmentBusinessService,
		departmentDataLoader,

		employeeBusinessService,
		employeeDataLoader,

		msopBusinessService,
		msopDataLoader,

		actionPointPriorityBusinessService,
		actionPointPriorityDataLoader,

		actionPointReferenceBusinessService,
		actionPointReferenceDataLoader,

		actionPointStatusBusinessService,
		actionPointStatusDataLoader,

		actionPointBusinessService,
		actionPointDataLoader,

		meetingDayBusinessService,
		meetingDayDataLoader,

		meetingDurationBusinessService,
		meetingDurationDataLoader,

		meetingFrequencyBusinessService,
		meetingFrequencyDataLoader,
	}) {
		Manufacturer.singleType = new GraphQLObjectType({
			name: 'Manufacturer',
			fields: () => ({
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
				user: {
					type: new GraphQLNonNull(RegisteredUser.singleType),
					resolve: async (_) => userDataLoader.getUserLoaderById().load(_.get('userId')),
				},
				department: {
					type: Department.singleType,
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? departmentDataLoader.getDepartmentLoaderById().load(id) : null),
				},
				departments: {
					type: Department.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						name: { type: GraphQLString },
						description: { type: GraphQLString },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await departmentBusinessService.search(Object.assign(searchCriteria, { manufacturerId: _.get('id') }))
						),
				},
				employee: {
					type: Employee.singleType,
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? employeeDataLoader.getEmployeeLoaderById().load(id) : null),
				},
				employees: {
					type: Employee.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						employeeReference: { type: GraphQLString },
						position: { type: GraphQLString },
						mobile: { type: GraphQLString },
						userId: { type: GraphQLID },
						reportingToEmployeeId: { type: GraphQLID },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await employeeBusinessService.search(Object.assign(searchCriteria, { manufacturerId: _.get('id') }))
						),
				},
				msop: {
					type: MSOP.singleType,
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? msopDataLoader.getMSOPLoaderById().load(id) : null),
				},
				msops: {
					type: MSOP.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						meetingName: { type: GraphQLString },
						durationId: { type: GraphQLID },
						frequencyId: { type: GraphQLID },
						meetingDayId: { type: GraphQLID },
						departmentId: { type: GraphQLID },
						chairPersonEmployeeId: { type: GraphQLID },
						actionLogSecretaryEmployeeId: { type: GraphQLID },
						attendeeId: { type: GraphQLID },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await msopBusinessService.search(Object.assign(searchCriteria, { manufacturerId: _.get('id') }))
						),
				},
				actionPointPriority: {
					type: ActionPointPriority.singleType,
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? actionPointPriorityDataLoader.getActionPointPriorityLoaderById().load(id) : null),
				},
				actionPointPriorities: {
					type: ActionPointPriority.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						name: { type: GraphQLString },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await actionPointPriorityBusinessService.search(Object.assign(searchCriteria, { manufacturerId: _.get('id') }))
						),
				},
				actionPointReference: {
					type: ActionPointReference.singleType,
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? actionPointReferenceDataLoader.getActionPointReferenceLoaderById().load(id) : null),
				},
				actionPointReferences: {
					type: ActionPointReference.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						name: { type: GraphQLString },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await actionPointReferenceBusinessService.search(Object.assign(searchCriteria, { manufacturerId: _.get('id') }))
						),
				},
				actionPointStatus: {
					type: ActionPointStatus.singleType,
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? actionPointStatusDataLoader.getActionPointStatusLoaderById().load(id) : null),
				},
				actionPointStatuses: {
					type: ActionPointStatus.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						name: { type: GraphQLString },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await actionPointStatusBusinessService.search(Object.assign(searchCriteria, { manufacturerId: _.get('id') }))
						),
				},
				actionPoint: {
					type: ActionPoint.singleType,
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? actionPointDataLoader.getActionPointLoaderById().load(id) : null),
				},
				actionPoints: {
					type: ActionPoint.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						msopId: { type: GraphQLID },
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
							await actionPointBusinessService.search(Object.assign(searchCriteria, { manufacturerId: _.get('id') }))
						),
				},
				meetingDay: {
					type: MeetingDay.singleType,
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? meetingDayDataLoader.getMeetingDayLoaderById().load(id) : null),
				},
				meetingDays: {
					type: MeetingDay.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						name: { type: GraphQLString },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await meetingDayBusinessService.search(Object.assign(searchCriteria, { manufacturerId: _.get('id') }))
						),
				},
				meetingDuration: {
					type: MeetingDuration.singleType,
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? meetingDurationDataLoader.getMeetingDurationLoaderById().load(id) : null),
				},
				meetingDurations: {
					type: MeetingDuration.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						name: { type: GraphQLString },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await meetingDurationBusinessService.search(Object.assign(searchCriteria, { manufacturerId: _.get('id') }))
						),
				},
				meetingFrequency: {
					type: MeetingFrequency.singleType,
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? meetingFrequencyDataLoader.getMeetingFrequencyLoaderById().load(id) : null),
				},
				meetingFrequencies: {
					type: MeetingFrequency.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						name: { type: GraphQLString },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await meetingFrequencyBusinessService.search(Object.assign(searchCriteria, { manufacturerId: _.get('id') }))
						),
				},
			}),
			interfaces: [NodeInterface],
		});

		Manufacturer.connectionDefinitionType = connectionDefinitions({
			name: 'Manufacturers',
			nodeType: Manufacturer.singleType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of manufacturers',
				},
			},
		});
	}

	getType = () => Manufacturer.singleType;

	getConnectionDefinitionType = () => Manufacturer.connectionDefinitionType;
}
