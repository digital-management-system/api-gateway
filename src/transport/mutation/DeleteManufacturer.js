import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const deleteManufacturer = ({ manufacturerBusinessService }) =>
	mutationWithClientMutationId({
		name: 'DeleteManufacturer',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			deletedManufacturerId: { type: new GraphQLNonNull(GraphQLID), resolve: ({ deletedManufacturerId }) => deletedManufacturerId },
		},
		mutateAndGetPayload: async ({ id }) => {
			const deletedManufacturerId = await manufacturerBusinessService.delete(id);

			return { deletedManufacturerId };
		},
	});

export default deleteManufacturer;
