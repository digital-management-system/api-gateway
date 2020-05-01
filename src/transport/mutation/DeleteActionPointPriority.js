import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const deleteActionPointPriority = ({ actionPointPriorityBusinessService }) =>
	mutationWithClientMutationId({
		name: 'DeleteActionPointPriority',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			deletedActionPointPriorityId: {
				type: new GraphQLNonNull(GraphQLID),
				resolve: ({ deletedActionPointPriorityId }) => deletedActionPointPriorityId,
			},
		},
		mutateAndGetPayload: async ({ id }) => ({ deletedActionPointPriorityId: await actionPointPriorityBusinessService.delete(id) }),
	});

export default deleteActionPointPriority;
