import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

export default class MeetingDurationTypeResolver {
	constructor() {
		this.meetingDurationType = new GraphQLObjectType({
			name: 'MeetingDuration',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
			},
			interfaces: [NodeInterface],
		});

		this.meetingDurationConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of meeting days',
				},
			},
			name: 'MeetingDurations',
			nodeType: this.meetingDurationType,
		});
	}

	getType = () => this.meetingDurationType;

	getConnectionDefinitionType = () => this.meetingDurationConnectionType;
}
