import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

export default mutationWithClientMutationId({
	name: 'DeleteEmployee',
	inputFields: {
		id: { type: new GraphQLNonNull(GraphQLID) },
	},
	outputFields: {
		deletedEmployeeId: { type: new GraphQLNonNull(GraphQLID), resolve: (employeeId) => employeeId },
	},
	mutateAndGetPayload: async ({ id }) => id,
});
