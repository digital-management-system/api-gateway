import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

export default class ActionPointPriorityTypeResolver {
	constructor() {
		this.actionPointPriorityType = new GraphQLObjectType({
			name: 'ActionPointPriority',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
			},
			interfaces: [NodeInterface],
		});

		this.actionPointPriorityConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of action point priorities',
				},
			},
			name: 'ActionPointPriorities',
			nodeType: this.actionPointPriorityType,
		});
	}

	getType = () => this.actionPointPriorityType;

	getConnectionDefinitionType = () => this.actionPointPriorityConnectionType;
}
