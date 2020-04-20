import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateEmployee = ({ employeeTypeResolver, employeeBusinessService }) =>
	mutationWithClientMutationId({
		name: 'UpdateEmployee',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			email: { type: new GraphQLNonNull(GraphQLString) },
			departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
		},
		outputFields: {
			employee: {
				type: employeeTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: (employee) => employee,
			},
		},
		mutateAndGetPayload: async (args) => {
			const { id, email, departmentIds } = await employeeBusinessService.update(args);

			return {
				cursor: id,
				node: {
					id,
					email,
					departmentIds,
				},
			};
		},
	});

export default updateEmployee;
