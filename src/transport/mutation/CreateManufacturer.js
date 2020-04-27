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
				resolve: async ({ id }) => ({
					cursor: id,
					node: await manufacturerDataLoader.getManufacturerLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await manufacturerBusinessService.create(Object.assign(args, { userId: decodedSessionToken.user_id })),
		}),
	});

export default createManufacturer;
