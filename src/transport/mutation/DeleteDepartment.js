import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const deleteDepartment = ({ departmentBusinessService }) =>
	mutationWithClientMutationId({
		name: 'DeleteDepartment',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			deletedDepartmentId: { type: new GraphQLNonNull(GraphQLID), resolve: ({ deletedDepartmentId }) => deletedDepartmentId },
		},
		mutateAndGetPayload: async ({ id }) => {
			const deletedDepartmentId = await departmentBusinessService.delete(id);

			return { deletedDepartmentId };
		},
	});

export default deleteDepartment;
