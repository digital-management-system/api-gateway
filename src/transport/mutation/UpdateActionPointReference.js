import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateActionPointReference = ({ actionPointReferenceTypeResolver, actionPointReferenceBusinessService, actionPointReferenceDataLoader }) =>
	mutationWithClientMutationId({
		name: 'UpdateActionPointReference',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(GraphQLString) },
		},
		outputFields: {
			actionPointReference: {
				type: actionPointReferenceTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => ({
					cursor: id,
					node: await actionPointReferenceDataLoader.getActionPointReferenceLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await actionPointReferenceBusinessService.update(args),
		}),
	});

export default updateActionPointReference;
