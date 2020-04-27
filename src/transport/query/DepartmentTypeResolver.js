import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import RelayHelper from './RelayHelper';
import Common from './Common';
import { NodeInterface } from '../interface';

export default class DepartmentTypeResolver {
	constructor({ departmentBusinessService, manufacturerTypeResolver, manufacturerDataLoader }) {
		this.departmentBusinessService = departmentBusinessService;

		this.departmentType = new GraphQLObjectType({
			name: 'Department',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
				description: { type: GraphQLString, resolve: (_) => _.get('description') },
				manufacturer: {
					type: new GraphQLNonNull(manufacturerTypeResolver.getType()),
					resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
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
			name: 'DepartmentType',
			nodeType: this.departmentType,
		});
	}

	getType = () => this.departmentType;

	getConnectionDefinitionType = () => this.departmentConnectionType;

	getDepartments = async (searchArgs) => {
		const { departmentIds } = searchArgs;
		const departments = await this.departmentBusinessService.search({ departmentIds });
		const totalCount = departments.length;

		if (totalCount === 0) {
			return Common.getEmptyResult();
		}

		const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, totalCount, 10, 1000);

		return Common.convertResultsToRelayConnectionResponse(departments, skip, limit, totalCount, hasNextPage, hasPreviousPage);
	};
}
