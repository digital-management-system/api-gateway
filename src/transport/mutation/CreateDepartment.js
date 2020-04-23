import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createDepartment = ({ departmentTypeResolver, departmentBusinessService }) =>
	mutationWithClientMutationId({
		name: 'CreateDepartment',
		inputFields: {
			name: { type: new GraphQLNonNull(GraphQLString) },
			description: { type: GraphQLString },
		},
		outputFields: {
			department: {
				type: departmentTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: (department) => department,
			},
		},
		mutateAndGetPayload: async (args) => {
			const node = await departmentBusinessService.create(args);

			return {
				cursor: node.get('id'),
				node,
			};
		},
	});

export default createDepartment;
