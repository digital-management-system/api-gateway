import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';

const manufacturerType = new GraphQLObjectType({
	name: 'Department_ManufacturerProperties',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
		name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	},
	interfaces: [NodeInterface],
});

const getDepartmentFields = ({ manufacturerDataLoader }) => ({
	id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
	name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	description: { type: GraphQLString, resolve: (_) => _.get('description') },
	manufacturer: {
		type: new GraphQLNonNull(manufacturerType),
		resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
	},
});

const getDepartmentType = ({ getDepartmentFields }) =>
	new GraphQLObjectType({
		name: 'DepartmentProperties',
		fields: {
			...getDepartmentFields,
		},
		interfaces: [NodeInterface],
	});

const getDepartmentConnectionType = ({ getDepartmentType }) =>
	connectionDefinitions({
		name: 'DepartmentsProperties',
		nodeType: getDepartmentType,
		connectionFields: {
			totalCount: {
				type: GraphQLInt,
				description: 'Total number of departments',
			},
		},
	});

class DepartmentTypeResolver {
	constructor({
		getDepartmentFields,
		convertToRelayConnection,
		employeeBusinessService,
		employeeDataLoader,
		getEmployeeType,
		getEmployeeConnectionType,
		getMSOPConnectionType,
		msopBusinessService,
		getActionPointConnectionType,
		actionPointBusinessService,
	}) {
		this.departmentType = new GraphQLObjectType({
			name: 'Department',
			fields: {
				...getDepartmentFields,
				employee: {
					type: getEmployeeType('DepartmentTypeResolver_EmployeeProperties'),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? employeeDataLoader.getEmployeeLoaderById().load(id) : null),
				},
				employees: {
					type: getEmployeeConnectionType('DepartmentTypeResolver_Connection_EmployeeProperties').connectionType,
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
					type: getMSOPConnectionType.connectionType,
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
					type: getActionPointConnectionType.connectionType,
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
			},
			interfaces: [NodeInterface],
		});

		this.departmentConnectionType = connectionDefinitions({
			name: 'Departments',
			nodeType: this.departmentType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of departments',
				},
			},
		});
	}

	getType = () => this.departmentType;

	getConnectionDefinitionType = () => this.departmentConnectionType;
}

export { getDepartmentFields, getDepartmentType, getDepartmentConnectionType, DepartmentTypeResolver };
