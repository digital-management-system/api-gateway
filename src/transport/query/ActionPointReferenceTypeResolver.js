import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';

export default class ActionPointReferenceTypeResolver {
	constructor() {
		this.actionPointReferenceType = new GraphQLObjectType({
			name: 'ActionPointReference',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
			},
			interfaces: [NodeInterface],
		});

		this.actionPointReferenceConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of action point references',
				},
			},
			name: 'ActionPointReferences',
			nodeType: this.actionPointReferenceType,
		});
	}

	getType = () => this.actionPointReferenceType;

	getConnectionDefinitionType = () => this.actionPointReferenceConnectionType;
}
