import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const deleteActionPointStatus = ({ actionPointStatusBusinessService }) =>
	mutationWithClientMutationId({
		name: 'DeleteActionPointStatus',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			deletedActionPointStatusId: {
				type: new GraphQLNonNull(GraphQLID),
				resolve: ({ deletedActionPointStatusId }) => deletedActionPointStatusId,
			},
		},
		mutateAndGetPayload: async ({ id }) => ({ deletedActionPointStatusId: await actionPointStatusBusinessService.delete(id) }),
	});

export default deleteActionPointStatus;
