import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createDepartment = ({ departmentTypeResolver, departmentBusinessService, departmentDataLoader }) =>
	mutationWithClientMutationId({
		name: 'CreateDepartment',
		inputFields: {
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
			const id = await departmentBusinessService.create(args);

			return {
				id,
			};
		},
	});

export default createDepartment;
