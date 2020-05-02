import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const deleteMeetingDuration = ({ actionPointPriorityBusinessService }) =>
	mutationWithClientMutationId({
		name: 'DeleteMeetingDuration',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			deletedMeetingDurationId: {
				type: new GraphQLNonNull(GraphQLID),
				resolve: ({ deletedMeetingDurationId }) => deletedMeetingDurationId,
			},
		},
		mutateAndGetPayload: async ({ id }) => ({ deletedMeetingDurationId: await actionPointPriorityBusinessService.delete(id) }),
	});

export default deleteMeetingDuration;
