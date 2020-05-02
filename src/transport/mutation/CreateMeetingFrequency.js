import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createMeetingFrequency = ({ actionPointPriorityTypeResolver, actionPointPriorityBusinessService, actionPointPriorityDataLoader }) =>
	mutationWithClientMutationId({
		name: 'CreateMeetingFrequency',
		inputFields: {
			manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(GraphQLString) },
		},
		outputFields: {
			actionPointPriority: {
				type: actionPointPriorityTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => ({
					cursor: id,
					node: await actionPointPriorityDataLoader.getMeetingFrequencyLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await actionPointPriorityBusinessService.create(args),
		}),
	});

export default createMeetingFrequency;
