import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';

const registeredUserType = new GraphQLObjectType({
	name: 'Employee_RegisteredUserProperties',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
		email: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('email') },
	},
	interfaces: [NodeInterface],
});

const manufacturerType = new GraphQLObjectType({
	name: 'Employee_ManufacturerProperties',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
		name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	},
	interfaces: [NodeInterface],
});

const departmentType = new GraphQLObjectType({
	name: 'Employee_DepartmentProperties',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
		name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
		description: { type: GraphQLString, resolve: (_) => _.get('description') },
	},
	interfaces: [NodeInterface],
});

const getEmployeeFields = ({
	convertToRelayConnection,
	userDataLoader,
	manufacturerDataLoader,
	departmentDataLoader,
	getActionPointConnectionType,
	actionPointBusinessService,
}) => ({
	id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
	employeeReference: { type: GraphQLString, resolve: (_) => _.get('employeeReference') },
	position: { type: GraphQLString, resolve: (_) => _.get('position') },
	mobile: { type: GraphQLString, resolve: (_) => _.get('mobile') },
	user: {
		type: new GraphQLNonNull(registeredUserType),
		resolve: async (_) => userDataLoader.getUserLoaderById().load(_.get('userId')),
	},
	manufacturer: {
		type: new GraphQLNonNull(manufacturerType),
		resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
	},
	departments: {
		type: new GraphQLNonNull(new GraphQLList(departmentType)),
		resolve: async (_) => departmentDataLoader.getDepartmentLoaderById().loadMany(_.get('departmentIds').toArray()),
	},
	actionPoints: {
		type: getActionPointConnectionType.connectionType,
		args: {
			...connectionArgs,
			ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
			departmentId: { type: GraphQLID },
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
				await actionPointBusinessService.search(Object.assign(searchCriteria, { assigneeId: _.get('id') }))
			),
	},
});

const getReportingEmployeeType = ({ getEmployeeFields }) => (name) =>
	new GraphQLObjectType({
		name,
		fields: {
			...getEmployeeFields,
		},
		interfaces: [NodeInterface],
	});

const getEmployeeType = ({ employeeDataLoader, getReportingEmployeeType, getEmployeeFields }) => (name) =>
	new GraphQLObjectType({
		name,
		fields: {
			...getEmployeeFields,
			reportingToEmployee: {
				type: getReportingEmployeeType(name + '_ReportingEmployeeProperties'),
				resolve: async (_) => {
					const reportingToEmployeeId = _.get('reportingToEmployeeId');

					return reportingToEmployeeId ? employeeDataLoader.getEmployeeLoaderById().load(reportingToEmployeeId) : null;
				},
			},
		},
		interfaces: [NodeInterface],
	});

const getEmployeeConnectionType = ({ getEmployeeType }) => (name) =>
	connectionDefinitions({
		name,
		nodeType: getEmployeeType('Connection_EmployeeProperties'),
		connectionFields: {
			totalCount: {
				type: GraphQLInt,
				description: 'Total number of employees',
			},
		},
	});

class EmployeeTypeResolver {
	constructor({ getEmployeeFields, employeeDataLoader, getReportingEmployeeType }) {
		this.employeeType = new GraphQLObjectType({
			name: 'Employee',
			fields: {
				...getEmployeeFields,
				reportingToEmployee: {
					type: getReportingEmployeeType('EmployeeTypeResolver_ReportingEmployeeProperties'),
					resolve: async (_) => {
						const reportingToEmployeeId = _.get('reportingToEmployeeId');

						return reportingToEmployeeId ? employeeDataLoader.getEmployeeLoaderById().load(reportingToEmployeeId) : null;
					},
				},
			},
			interfaces: [NodeInterface],
		});
		this.employeeConnectionType = connectionDefinitions({
			name: 'Employees',
			nodeType: this.employeeType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of employees',
				},
			},
		});
	}

	getType = () => this.employeeType;

	getConnectionDefinitionType = () => this.employeeConnectionType;
}

export { getEmployeeFields, getReportingEmployeeType, getEmployeeType, getEmployeeConnectionType, EmployeeTypeResolver };
