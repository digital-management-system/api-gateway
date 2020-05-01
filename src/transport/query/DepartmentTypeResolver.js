import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import SortingOptionPair from './SortingOptionPair';

export default class DepartmentTypeResolver {
	constructor({ convertToRelayConnection, employeeWithoutDepartmentTypeResolver, employeeDataLoader, employeeBusinessService }) {
		this.departmentType = new GraphQLObjectType({
			name: 'Department',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
				description: { type: GraphQLString, resolve: (_) => _.get('description') },
				employee: {
					type: employeeWithoutDepartmentTypeResolver.getType(),
					args: {
						id: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { id }) => (id ? employeeDataLoader.getEmployeeLoaderById().load(id) : null),
				},
				employees: {
					type: employeeWithoutDepartmentTypeResolver.getConnectionDefinitionType().connectionType,
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
			},
			interfaces: [NodeInterface],
		});

		this.departmentConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of departments',
				},
			},
			name: 'Departments',
			nodeType: this.departmentType,
		});
	}

	getType = () => this.departmentType;

	getConnectionDefinitionType = () => this.departmentConnectionType;
}
