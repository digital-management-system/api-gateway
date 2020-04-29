import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const deleteActionReference = ({ actionReferenceBusinessService }) =>
	mutationWithClientMutationId({
		name: 'DeleteActionReference',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			deletedActionReferenceId: { type: new GraphQLNonNull(GraphQLID), resolve: ({ deletedActionReferenceId }) => deletedActionReferenceId },
		},
		mutateAndGetPayload: async ({ id }) => ({ deletedActionReferenceId: await actionReferenceBusinessService.delete(id) }),
	});

export default deleteActionReference;
