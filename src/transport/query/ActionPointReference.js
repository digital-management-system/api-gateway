import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import Manufacturer from './Manufacturer';

export default class ActionPointReference {
	static singleType = null;
	static connectionDefinitionType = null;

	constructor({ manufacturerDataLoader }) {
		ActionPointReference.singleType = new GraphQLObjectType({
			name: 'ActionPointReference',
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

		ActionPointReference.connectionDefinitionType = connectionDefinitions({
			name: 'ActionPointReferences',
			nodeType: ActionPointReference.singleType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of action point references',
				},
			},
		});
	}

	getType = () => ActionPointReference.singleType;

	getConnectionDefinitionType = () => ActionPointReference.connectionDefinitionType;
}
