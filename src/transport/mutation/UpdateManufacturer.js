import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateManufacturer = ({ manufacturerTypeResolver, manufacturerBusinessService, decodedSessionToken }) =>
	mutationWithClientMutationId({
		name: 'UpdateManufacturer',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(GraphQLString) },
		},
		outputFields: {
			manufacturer: {
				type: manufacturerTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: (manufacturer) => manufacturer,
			},
		},
		mutateAndGetPayload: async (args) => {
			const node = await manufacturerBusinessService.update(Object.assign(args, { userId: decodedSessionToken.user_id }));

			return {
				cursor: node.get('id'),
				node,
			};
		},
	});

export default updateManufacturer;
