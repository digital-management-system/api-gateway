import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateActionReference = ({ actionReferenceTypeResolver, actionReferenceBusinessService, actionReferenceDataLoader }) =>
	mutationWithClientMutationId({
		name: 'UpdateActionReference',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(GraphQLString) },
			manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			actionReference: {
				type: actionReferenceTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => ({
					cursor: id,
					node: await actionReferenceDataLoader.getActionReferenceLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await actionReferenceBusinessService.update(args),
		}),
	});

export default updateActionReference;
