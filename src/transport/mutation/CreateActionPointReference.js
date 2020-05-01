import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createActionPointReference = ({ actionPointReferenceTypeResolver, actionPointReferenceBusinessService, actionPointReferenceDataLoader }) =>
	mutationWithClientMutationId({
		name: 'CreateActionPointReference',
		inputFields: {
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
			id: await actionPointReferenceBusinessService.create(args),
		}),
	});

export default createActionPointReference;
