import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const deleteMeetingDay = ({ actionPointPriorityBusinessService }) =>
	mutationWithClientMutationId({
		name: 'DeleteMeetingDay',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			deletedMeetingDayId: {
				type: new GraphQLNonNull(GraphQLID),
				resolve: ({ deletedMeetingDayId }) => deletedMeetingDayId,
			},
		},
		mutateAndGetPayload: async ({ id }) => ({ deletedMeetingDayId: await actionPointPriorityBusinessService.delete(id) }),
	});

export default deleteMeetingDay;
