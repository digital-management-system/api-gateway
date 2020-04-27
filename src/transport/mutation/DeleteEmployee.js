import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const deleteEmployee = ({ employeeBusinessService }) =>
	mutationWithClientMutationId({
		name: 'DeleteEmployee',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			deletedEmployeeId: { type: new GraphQLNonNull(GraphQLID), resolve: ({ deletedEmployeeId }) => deletedEmployeeId },
		},
		mutateAndGetPayload: async ({ id }) => ({ deletedEmployeeId: await employeeBusinessService.delete(id) }),
	});

export default deleteEmployee;
