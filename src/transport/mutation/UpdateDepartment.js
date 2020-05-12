import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateDepartment = ({ department, departmentBusinessService, departmentDataLoader }) =>
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
				type: department.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => ({
					cursor: id,
					node: await departmentDataLoader.getDepartmentLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await departmentBusinessService.update(args),
		}),
	});

export default updateDepartment;
