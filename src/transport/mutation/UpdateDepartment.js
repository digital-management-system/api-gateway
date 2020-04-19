import { GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateDepartment = ({ departmentTypeResolver, departmentBusinessService }) =>
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
		mutateAndGetPayload: async (args) => {
			const { id, name, description } = await departmentBusinessService.update(args);

			return {
				cursor: id,
				node: {
					id,
					name,
					description,
				},
			};
		},
	});

export default updateDepartment;
