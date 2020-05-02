import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateActionPointPriority = ({ actionPointPriorityTypeResolver, actionPointPriorityBusinessService, actionPointPriorityDataLoader }) =>
	mutationWithClientMutationId({
		name: 'UpdateActionPointPriority',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(GraphQLString) },
		},
		outputFields: {
			actionPointPriority: {
				type: actionPointPriorityTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => ({
					cursor: id,
					node: await actionPointPriorityDataLoader.getActionPointPriorityLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await actionPointPriorityBusinessService.update(args),
		}),
	});

export default updateActionPointPriority;
