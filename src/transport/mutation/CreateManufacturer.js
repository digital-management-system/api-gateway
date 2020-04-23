import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createManufacturer = ({ manufacturerTypeResolver, manufacturerBusinessService }) =>
	mutationWithClientMutationId({
		name: 'CreateManufacturer',
		inputFields: {
			name: { type: new GraphQLNonNull(GraphQLString) },
		},
		outputFields: {
			manufacturer: {
				type: manufacturerTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: (manufacturer) => manufacturer,
			},
		},
		mutateAndGetPayload: async (args) => {
			const node = await manufacturerBusinessService.create(args);

			return {
				cursor: node.get('id'),
				node,
			};
		},
	});

export default createManufacturer;
