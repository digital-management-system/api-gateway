import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

export default class MeetingDayTypeResolver {
	constructor() {
		this.meetingDayType = new GraphQLObjectType({
			name: 'MeetingDay',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
			},
			interfaces: [NodeInterface],
		});

		this.meetingDayConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of meeting days',
				},
			},
			name: 'MeetingDays',
			nodeType: this.meetingDayType,
		});
	}

	getType = () => this.meetingDayType;

	getConnectionDefinitionType = () => this.meetingDayConnectionType;
}
