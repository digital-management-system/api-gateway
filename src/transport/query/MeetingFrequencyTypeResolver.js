import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

export default class MeetingFrequencyTypeResolver {
	constructor() {
		this.meetingFrequencyType = new GraphQLObjectType({
			name: 'MeetingFrequency',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
			},
			interfaces: [NodeInterface],
		});

		this.meetingFrequencyConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of meeting frequencies',
				},
			},
			name: 'MeetingFrequencies',
			nodeType: this.meetingFrequencyType,
		});
	}

	getType = () => this.meetingFrequencyType;

	getConnectionDefinitionType = () => this.meetingFrequencyConnectionType;
}
