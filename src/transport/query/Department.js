import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';
import Manufacturer from './Manufacturer';
import Employee from './Employee';
import ActionPoint from './ActionPoint';
import MSOP from './MSOP';

export default class Department {
	static singleType = null;
	static connectionDefinitionType = null;

	constructor({
		convertToRelayConnection,
		employeeBusinessService,
		employeeDataLoader,
		msopBusinessService,
		actionPointBusinessService,
		manufacturerDataLoader,
	}) {
		Department.singleType = new GraphQLObjectType({
			name: 'Department',
			fields: () => ({
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
				description: { type: GraphQLString, resolve: (_) => _.get('description') },
				manufacturer: {
					type: new GraphQLNonNull(Manufacturer.singleType),
					resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
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
							await employeeBusinessService.search(Object.assign(searchCriteria, { departmentId: _.get('id') }))
						),
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
						chairPersonEmployeeId: { type: GraphQLID },
						actionLogSecretaryEmployeeId: { type: GraphQLID },
						attendeeId: { type: GraphQLID },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchCriteria) =>
						convertToRelayConnection(
							searchCriteria,
							await msopBusinessService.search(Object.assign(searchCriteria, { departmentId: _.get('id') }))
						),
				},
				actionPoints: {
					type: ActionPoint.connectionDefinitionType.connectionType,
					args: {
						...connectionArgs,
						ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						assigneeId: { type: GraphQLID },
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
							await actionPointBusinessService.search(Object.assign(searchCriteria, { departmentId: _.get('id') }))
						),
				},
			}),
			interfaces: [NodeInterface],
		});

		Department.connectionDefinitionType = connectionDefinitions({
			name: 'Departments',
			nodeType: Department.singleType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of departments',
				},
			},
		});
	}

	getType = () => Department.singleType;

	getConnectionDefinitionType = () => Department.connectionDefinitionType;
}
