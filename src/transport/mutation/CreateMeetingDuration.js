import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createMeetingDuration = ({ actionPointPriorityTypeResolver, actionPointPriorityBusinessService, actionPointPriorityDataLoader }) =>
	mutationWithClientMutationId({
		name: 'CreateMeetingDuration',
		inputFields: {
			manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(GraphQLString) },
		},
		outputFields: {
			actionPointPriority: {
				type: actionPointPriorityTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => ({
					cursor: id,
					node: await actionPointPriorityDataLoader.getMeetingDurationLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await actionPointPriorityBusinessService.create(args),
		}),
	});

export default createMeetingDuration;
