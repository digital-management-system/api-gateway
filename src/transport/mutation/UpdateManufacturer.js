import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateManufacturer = ({ manufacturerTypeResolver, manufacturerBusinessService, decodedSessionToken, manufacturerDataLoader }) =>
	mutationWithClientMutationId({
		name: 'UpdateManufacturer',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(GraphQLString) },
		},
		outputFields: {
			manufacturer: {
				type: manufacturerTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => {
					const node = await manufacturerDataLoader.getManufacturerLoaderById().load(id);

					return {
						cursor: id,
						node,
					};
				},
			},
		},
		mutateAndGetPayload: async (args) => {
			const id = await manufacturerBusinessService.update(Object.assign(args, { userId: decodedSessionToken.user_id }));

			return {
				id,
			};
		},
	});

export default updateManufacturer;
