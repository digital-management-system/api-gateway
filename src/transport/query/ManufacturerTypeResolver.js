import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';

export default class ManufacturerTypeResolver {
	constructor({
		convertToRelayConnection,
		registeredUserTypeResolver,
		userDataLoader,
		departmentTypeResolver,
		departmentBusinessService,
		departmentDataLoader,
		employeeTypeResolver,
		employeeBusinessService,
		employeeDataLoader,
		msopTypeResolver,
		msopBusinessService,
		msopDataLoader,
		actionPointPriorityTypeResolver,
		actionPointPriorityBusinessService,
		actionPointPriorityDataLoader,
		actionPointReferenceTypeResolver,
		actionPointReferenceBusinessService,
		actionPointReferenceDataLoader,
		actionPointStatusTypeResolver,
		actionPointStatusBusinessService,
		actionPointStatusDataLoader,
		actionPointTypeResolver,
		actionPointBusinessService,
		actionPointDataLoader,
		meetingDayTypeResolver,
		meetingDayBusinessService,
		meetingDayDataLoader,
		meetingDurationTypeResolver,
		meetingDurationBusinessService,
		meetingDurationDataLoader,
		meetingFrequencyTypeResolver,
		meetingFrequencyBusinessService,
		meetingFrequencyDataLoader,
	}) {
		this.manufacturerType = new GraphQLObjectType({
			name: 'Manufacturer',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
				user: {
					type: new GraphQLNonNull(registeredUserTypeResolver.getType()),
					resolve: async (_) => userDataLoader.getUserLoaderById().load(_.get('userId')),
				},
				department: {
					type: departmentTypeResolver.getType(),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? departmentDataLoader.getDepartmentLoaderById().load(id) : null),
				},
				departments: {
					type: departmentTypeResolver.getConnectionDefinitionType().connectionType,
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
					type: employeeTypeResolver.getType(),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? employeeDataLoader.getEmployeeLoaderById().load(id) : null),
				},
				employees: {
					type: employeeTypeResolver.getConnectionDefinitionType().connectionType,
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
					type: msopTypeResolver.getType(),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? msopDataLoader.getMSOPLoaderById().load(id) : null),
				},
				msops: {
					type: msopTypeResolver.getConnectionDefinitionType().connectionType,
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
					type: actionPointPriorityTypeResolver.getType(),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? actionPointPriorityDataLoader.getActionPointPriorityLoaderById().load(id) : null),
				},
				actionPointPriorities: {
					type: actionPointPriorityTypeResolver.getConnectionDefinitionType().connectionType,
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
					type: actionPointReferenceTypeResolver.getType(),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? actionPointReferenceDataLoader.getActionPointReferenceLoaderById().load(id) : null),
				},
				actionPointReferences: {
					type: actionPointReferenceTypeResolver.getConnectionDefinitionType().connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						name: { type: GraphQLString },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await actionPointReferenceBusinessService(Object.assign(searchCriteria, { manufacturerId: _.get('id') }))
						),
				},
				actionPointStatus: {
					type: actionPointStatusTypeResolver.getType(),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? actionPointStatusDataLoader.getActionPointStatusLoaderById().load(id) : null),
				},
				actionPointStatuses: {
					type: actionPointStatusTypeResolver.getConnectionDefinitionType().connectionType,
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
					type: actionPointTypeResolver.getType(),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? actionPointDataLoader.getActionPointLoaderById().load(id) : null),
				},
				actionPoints: {
					type: actionPointTypeResolver.getConnectionDefinitionType().connectionType,
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
					type: meetingDayTypeResolver.getType(),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? meetingDayDataLoader.getMeetingDayLoaderById().load(id) : null),
				},
				meetingDays: {
					type: meetingDayTypeResolver.getConnectionDefinitionType().connectionType,
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
					type: meetingDurationTypeResolver.getType(),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? meetingDurationDataLoader.getMeetingDurationLoaderById().load(id) : null),
				},
				meetingDurations: {
					type: meetingDurationTypeResolver.getConnectionDefinitionType().connectionType,
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
					type: meetingFrequencyTypeResolver.getType(),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? meetingFrequencyDataLoader.getMeetingFrequencyLoaderById().load(id) : null),
				},
				meetingFrequencies: {
					type: meetingFrequencyTypeResolver.getConnectionDefinitionType().connectionType,
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
			},
			interfaces: [NodeInterface],
		});

		this.manufacturerConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of manufacturers',
				},
			},
			name: 'Manufacturers',
			nodeType: this.manufacturerType,
		});
	}

	getType = () => this.manufacturerType;

	getConnectionDefinitionType = () => this.manufacturerConnectionType;
}
