import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateDepartment = ({ departmentTypeResolver, departmentBusinessService, departmentDataLoader }) =>
	mutationWithClientMutationId({
		name: 'UpdateDepartment',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(GraphQLString) },
			description: { type: GraphQLString },
			manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
		},
		outputFields: {
			department: {
				type: departmentTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => {
					const node = await departmentDataLoader.getDepartmentLoaderById().load(id);

					return {
						cursor: id,
						node,
					};
				},
			},
		},
		mutateAndGetPayload: async (args) => {
			const id = await departmentBusinessService.update(args);

			return {
				id,
			};
		},
	});

export default updateDepartment;
