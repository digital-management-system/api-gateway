import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const deleteMeetingFrequency = ({ actionPointPriorityBusinessService }) =>
	mutationWithClientMutationId({
		name: 'DeleteMeetingFrequency',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			deletedMeetingFrequencyId: {
				type: new GraphQLNonNull(GraphQLID),
				resolve: ({ deletedMeetingFrequencyId }) => deletedMeetingFrequencyId,
			},
		},
		mutateAndGetPayload: async ({ id }) => ({ deletedMeetingFrequencyId: await actionPointPriorityBusinessService.delete(id) }),
	});

export default deleteMeetingFrequency;
