import { GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateDepartment = ({ departmentTypeResolver }) =>
	mutationWithClientMutationId({
		name: 'UpdateDepartment',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(GraphQLString) },
			description: { type: GraphQLString },
		},
		outputFields: {
			department: {
				type: departmentTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: (department) => department,
			},
		},
		mutateAndGetPayload: async ({ id }, { dataLoaders }) =>
			(await departmentTypeResolver.getDepartments({ departmentIds: [{ id }] }, dataLoaders)).edges[0],
	});

export default updateDepartment;
