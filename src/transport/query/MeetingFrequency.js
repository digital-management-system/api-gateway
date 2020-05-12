import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import Manufacturer from './Manufacturer';

export default class MeetingFrequency {
	static singleType = null;
	static connectionDefinitionType = null;

	constructor({ manufacturerDataLoader }) {
		MeetingFrequency.singleType = new GraphQLObjectType({
			name: 'MeetingFrequency',
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

		MeetingFrequency.connectionDefinitionType = connectionDefinitions({
			name: 'MeetingFrequencies',
			nodeType: MeetingFrequency.singleType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of meeting frequencies',
				},
			},
		});
	}

	getType = () => MeetingFrequency.singleType;

	getConnectionDefinitionType = () => MeetingFrequency.connectionDefinitionType;
}
