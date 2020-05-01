import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createActionPointStatus = ({ actionPointStatusTypeResolver, actionPointStatusBusinessService, actionPointStatusDataLoader }) =>
	mutationWithClientMutationId({
		name: 'CreateActionPointStatus',
		inputFields: {
			manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(GraphQLString) },
		},
		outputFields: {
			actionPointStatus: {
				type: actionPointStatusTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => ({
					cursor: id,
					node: await actionPointStatusDataLoader.getActionPointStatusLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await actionPointStatusBusinessService.create(args),
		}),
	});

export default createActionPointStatus;
