import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createManufacturer = ({ manufacturerTypeResolver, manufacturerBusinessService, decodedSessionToken, manufacturerDataLoader }) =>
	mutationWithClientMutationId({
		name: 'CreateManufacturer',
		inputFields: {
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
			const id = await manufacturerBusinessService.create(Object.assign(args, { userId: decodedSessionToken.user_id }));

			return {
				id,
			};
		},
	});

export default createManufacturer;
