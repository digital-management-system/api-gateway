import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import Manufacturer from './Manufacturer';

export default class ActionPointStatus {
	static singleType = null;
	static connectionDefinitionType = null;

	constructor({ manufacturerDataLoader }) {
		ActionPointStatus.singleType = new GraphQLObjectType({
			name: 'ActionPointStatus',
			fields: () => ({
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
				manufacturer: {
					type: new GraphQLNonNull(Manufacturer.singleType),
					resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
				},
			}),
			interfaces: [NodeInterface],
		});

		ActionPointStatus.connectionDefinitionType = connectionDefinitions({
			name: 'ActionPointStatuses',
			nodeType: ActionPointStatus.singleType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of action point statuses',
				},
			},
		});
	}

	getType = () => ActionPointStatus.singleType;

	getConnectionDefinitionType = () => ActionPointStatus.connectionDefinitionType;
}
