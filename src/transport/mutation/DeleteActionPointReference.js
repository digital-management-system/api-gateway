import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const deleteActionPointReference = ({ actionPointReferenceBusinessService }) =>
	mutationWithClientMutationId({
		name: 'DeleteActionPointReference',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			deletedActionPointReferenceId: {
				type: new GraphQLNonNull(GraphQLID),
				resolve: ({ deletedActionPointReferenceId }) => deletedActionPointReferenceId,
			},
		},
		mutateAndGetPayload: async ({ id }) => ({ deletedActionPointReferenceId: await actionPointReferenceBusinessService.delete(id) }),
	});

export default deleteActionPointReference;
