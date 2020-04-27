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
				resolve: async ({ id }) => ({
					cursor: id,
					node: await manufacturerDataLoader.getManufacturerLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await manufacturerBusinessService.update(Object.assign(args, { userId: decodedSessionToken.user_id })),
		}),
	});

export default updateManufacturer;
