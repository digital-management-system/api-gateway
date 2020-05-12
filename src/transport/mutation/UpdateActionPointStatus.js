import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateActionPointStatus = ({ actionPointStatus, actionPointStatusBusinessService, actionPointStatusDataLoader }) =>
	mutationWithClientMutationId({
		name: 'UpdateActionPointStatus',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(GraphQLString) },
		},
		outputFields: {
			actionPointStatus: {
				type: actionPointStatus.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => ({
					cursor: id,
					node: await actionPointStatusDataLoader.getActionPointStatusLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await actionPointStatusBusinessService.update(args),
		}),
	});

export default updateActionPointStatus;
