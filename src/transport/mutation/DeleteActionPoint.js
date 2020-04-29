import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const deleteActionPoint = ({ actionPointBusinessService }) =>
	mutationWithClientMutationId({
		name: 'DeleteActionPoint',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			deletedActionPointId: { type: new GraphQLNonNull(GraphQLID), resolve: ({ deletedActionPointId }) => deletedActionPointId },
		},
		mutateAndGetPayload: async ({ id }) => ({ deletedActionPointId: await actionPointBusinessService.delete(id) }),
	});

export default deleteActionPoint;
