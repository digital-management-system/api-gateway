import { GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { DepartmentConnectionDefinitions, getDepartments } from '../type';

export default mutationWithClientMutationId({
	name: 'UpdateDepartment',
	inputFields: {
		id: { type: new GraphQLNonNull(GraphQLID) },
		name: { type: new GraphQLNonNull(GraphQLString) },
		description: { type: GraphQLString },
	},
	outputFields: {
		department: {
			type: DepartmentConnectionDefinitions.edgeType,
			resolve: (department) => department,
		},
	},
	mutateAndGetPayload: async ({ id }, { dataLoaders }) => (await getDepartments({ departmentIds: [{ id }] }, dataLoaders)).edges[0],
});
