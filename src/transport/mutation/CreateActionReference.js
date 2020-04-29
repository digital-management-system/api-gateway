import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createActionReference = ({ actionReferenceTypeResolver, actionReferenceBusinessService, actionReferenceDataLoader }) =>
	mutationWithClientMutationId({
		name: 'CreateActionReference',
		inputFields: {
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
			id: await actionReferenceBusinessService.create(args),
		}),
	});

export default createActionReference;
