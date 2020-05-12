import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import Manufacturer from './Manufacturer';

export default class MeetingDuration {
	static singleType = null;
	static connectionDefinitionType = null;

	constructor({ manufacturerDataLoader }) {
		MeetingDuration.singleType = new GraphQLObjectType({
			name: 'MeetingDuration',
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

		MeetingDuration.connectionDefinitionType = connectionDefinitions({
			name: 'MeetingDurations',
			nodeType: MeetingDuration.singleType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of meeting durations',
				},
			},
		});
	}

	getType = () => MeetingDuration.singleType;

	getConnectionDefinitionType = () => MeetingDuration.connectionDefinitionType;
}
