import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

export default mutationWithClientMutationId({
	name: 'DeleteDepartment',
	inputFields: {
		id: { type: new GraphQLNonNull(GraphQLID) },
	},
	outputFields: {
		deletedDepartmentId: { type: new GraphQLNonNull(GraphQLID), resolve: (departmentId) => departmentId },
	},
	mutateAndGetPayload: async ({ id }) => id,
});
