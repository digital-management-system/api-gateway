import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import RelayHelper from './RelayHelper';
import Common from './Common';
import SortingOptionPair from './SortingOptionPair';
import MSOPMeetingFrequency from './MSOPMeetingFrequency';
import MSOPMeetingDay from './MSOPMeetingDay';

export default class ManufacturerTypeResolver {
	constructor({
		registeredUserTypeResolver,
		manufacturerBusinessService,
		userDataLoader,
		departmentDataLoader,
		departmentTypeResolver,
		employeeTypeResolver,
		employeeDataLoader,
		msopTypeResolver,
		msopDataLoader,
	}) {
		this.manufacturerBusinessService = manufacturerBusinessService;

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
						departmentId: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { departmentId }) => (departmentId ? departmentDataLoader.getDepartmentLoaderById().load(departmentId) : null),
				},
				departments: {
					type: departmentTypeResolver.getConnectionDefinitionType().connectionType,
					args: {
						...connectionArgs,
						departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchArgs) => departmentTypeResolver.getDepartments(searchArgs),
				},
				employee: {
					type: employeeTypeResolver.getType(),
					args: {
						employeeId: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { employeeId }) => (employeeId ? employeeDataLoader.getEmployeeLoaderById().load(employeeId) : null),
				},
				employees: {
					type: employeeTypeResolver.getConnectionDefinitionType().connectionType,
					args: {
						...connectionArgs,
						employeeIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchArgs) => employeeTypeResolver.getEmployees(searchArgs),
				},
				msop: {
					type: msopTypeResolver.getType(),
					args: {
						msopId: { type: new GraphQLNonNull(GraphQLID) },
					},
					resolve: async (_, { msopId }) => (msopId ? msopDataLoader.getMSOPLoaderById().load(msopId) : null),
				},
				msops: {
					type: msopTypeResolver.getConnectionDefinitionType().connectionType,
					args: {
						...connectionArgs,
						msopIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
						sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
					},
					resolve: async (_, searchArgs) => msopTypeResolver.getMSOPs(searchArgs),
				},
				msopMeetingFrequencies: {
					type: new GraphQLList(MSOPMeetingFrequency),
					resolve: () => [0, 1, 2],
				},
				msopMeetingDays: {
					type: new GraphQLList(MSOPMeetingDay),
					resolve: () => [0, 1, 2, 3, 4, 5, 6],
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
			name: 'ManufacturerType',
			nodeType: this.manufacturerType,
		});
	}

	getType = () => this.manufacturerType;

	getConnectionDefinitionType = () => this.manufacturerConnectionType;

	getManufacturers = async (searchArgs) => {
		const { manufacturerIds } = searchArgs;
		const manufacturers = await this.manufacturerBusinessService.search({ manufacturerIds });
		const totalCount = manufacturers.length;

		if (totalCount === 0) {
			return Common.getEmptyResult();
		}

		const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, totalCount, 10, 1000);

		return Common.convertResultsToRelayConnectionResponse(manufacturers, skip, limit, totalCount, hasNextPage, hasPreviousPage);
	};
}
