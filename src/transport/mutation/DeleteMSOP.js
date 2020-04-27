import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const deleteMSOP = ({ msopBusinessService }) =>
	mutationWithClientMutationId({
		name: 'DeleteMSOP',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			deletedMSOPId: { type: new GraphQLNonNull(GraphQLID), resolve: ({ deletedMSOPId }) => deletedMSOPId },
		},
		mutateAndGetPayload: async ({ id }) => ({ deletedMSOPId: await msopBusinessService.delete(id) }),
	});

export default deleteMSOP;
