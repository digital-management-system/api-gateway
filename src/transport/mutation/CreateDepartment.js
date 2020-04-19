import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import cuid from 'cuid';

const createDepartment = ({ departmentResolver }) =>
	mutationWithClientMutationId({
		name: 'CreateDepartment',
		inputFields: {
			name: { type: new GraphQLNonNull(GraphQLString) },
			description: { type: GraphQLString },
		},
		outputFields: {
			department: {
				type: departmentResolver.getConnectionDefinitionType().edgeType,
				resolve: (department) => department,
			},
		},
		mutateAndGetPayload: async (args, { dataLoaders }) =>
			(await departmentResolver.getDepartments({ departmentIds: [cuid()] }, dataLoaders)).edges[0],
	});

export default createDepartment;
