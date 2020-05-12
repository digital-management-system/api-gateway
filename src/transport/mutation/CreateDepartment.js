import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createDepartment = ({ department, departmentBusinessService, departmentDataLoader }) =>
	mutationWithClientMutationId({
		name: 'CreateDepartment',
		inputFields: {
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
			id: await departmentBusinessService.create(args),
		}),
	});

export default createDepartment;
