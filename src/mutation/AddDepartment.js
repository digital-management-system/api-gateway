import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import cuid from 'cuid';
import { DepartmentConnectionDefinitions, getDepartments } from '../type';

export default mutationWithClientMutationId({
	name: 'AddDepartment',
	inputFields: {
		name: { type: new GraphQLNonNull(GraphQLString) },
		description: { type: GraphQLString },
	},
	outputFields: {
		department: {
			type: DepartmentConnectionDefinitions.edgeType,
			resolve: (department) => department,
		},
	},
	mutateAndGetPayload: async (args, { dataLoaders }) => (await getDepartments({ departmentIds: [cuid()] }, dataLoaders)).edges[0],
});
