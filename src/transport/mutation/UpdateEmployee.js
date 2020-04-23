import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateEmployee = ({ employeeTypeResolver, employeeBusinessService }) =>
	mutationWithClientMutationId({
		name: 'UpdateEmployee',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			email: { type: new GraphQLNonNull(GraphQLString) },
			employeeReference: { type: new GraphQLNonNull(GraphQLString) },
			departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
		},
		outputFields: {
			employee: {
				type: employeeTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: (employee) => employee,
			},
		},
		mutateAndGetPayload: async (args) => {
			const node = await employeeBusinessService.update(args);

			return {
				cursor: node.get('id'),
				node,
			};
		},
	});

export default updateEmployee;
