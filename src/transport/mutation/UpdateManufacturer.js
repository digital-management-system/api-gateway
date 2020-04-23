import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateManufacturer = ({ manufacturerTypeResolver, manufacturerBusinessService }) =>
	mutationWithClientMutationId({
		name: 'UpdateManufacturer',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(GraphQLString) },
			userIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
		},
		outputFields: {
			manufacturer: {
				type: manufacturerTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: (manufacturer) => manufacturer,
			},
		},
		mutateAndGetPayload: async (args) => {
			const node = await manufacturerBusinessService.update(args);

			return {
				cursor: node.get('id'),
				node,
			};
		},
	});

export default updateManufacturer;
