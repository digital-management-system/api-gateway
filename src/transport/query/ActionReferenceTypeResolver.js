import { GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import RelayHelper from './RelayHelper';
import Common from './Common';

export default class ActionReferenceTypeResolver {
	constructor({ actionReferenceBusinessService }) {
		this.actionReferenceBusinessService = actionReferenceBusinessService;

		this.actionReferenceType = new GraphQLObjectType({
			name: 'ActionReference',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
			},
			interfaces: [NodeInterface],
		});

		this.actionReferenceConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of action references',
				},
			},
			name: 'ActionReferenceType',
			nodeType: this.actionReferenceType,
		});
	}

	getType = () => this.actionReferenceType;

	getConnectionDefinitionType = () => this.actionReferenceConnectionType;

	getActionReferences = async (searchArgs) => {
		const { actionReferenceIds } = searchArgs;
		const actionReferences = await this.actionReferenceBusinessService.search({ actionReferenceIds });
		const totalCount = actionReferences.length;

		if (totalCount === 0) {
			return Common.getEmptyResult();
		}

		const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, totalCount, 10, 1000);

		return Common.convertResultsToRelayConnectionResponse(actionReferences, skip, limit, totalCount, hasNextPage, hasPreviousPage);
	};
}
