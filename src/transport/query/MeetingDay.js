import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import Manufacturer from './Manufacturer';

export default class MeetingDay {
	static singleType = null;
	static connectionDefinitionType = null;

	constructor({ manufacturerDataLoader }) {
		MeetingDay.singleType = new GraphQLObjectType({
			name: 'MeetingDay',
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

		MeetingDay.connectionDefinitionType = connectionDefinitions({
			name: 'MeetingDays',
			nodeType: MeetingDay.singleType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of meeting days',
				},
			},
		});
	}

	getType = () => MeetingDay.singleType;

	getConnectionDefinitionType = () => MeetingDay.connectionDefinitionType;
}
