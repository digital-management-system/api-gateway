import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

export default class ActionPointStatusTypeResolver {
	constructor() {
		this.actionPointStatusType = new GraphQLObjectType({
			name: 'ActionPointStatus',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
			},
			interfaces: [NodeInterface],
		});

		this.actionPointStatusConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of action point statuses',
				},
			},
			name: 'ActionPointStatuses',
			nodeType: this.actionPointStatusType,
		});
	}

	getType = () => this.actionPointStatusType;

	getConnectionDefinitionType = () => this.actionPointStatusConnectionType;
}
