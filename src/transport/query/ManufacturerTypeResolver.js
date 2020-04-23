import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import RelayHelper from './RelayHelper';
import Common from './Common';
import { NodeInterface } from '../interface';

export default class ManufacturerTypeResolver {
	constructor({ registeredUserTypeResolver, manufacturerBusinessService }) {
		this.manufacturerBusinessService = manufacturerBusinessService;

		this.manufacturerType = new GraphQLObjectType({
			name: 'Manufacturer',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
				users: {
					type: new GraphQLNonNull(new GraphQLList(registeredUserTypeResolver.getType())),
					resolve: async (_) => _.get('users').toArray(),
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