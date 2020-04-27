import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateEmployee = ({ employeeTypeResolver, employeeBusinessService, employeeDataLoader }) =>
	mutationWithClientMutationId({
		name: 'UpdateEmployee',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			userId: { type: new GraphQLNonNull(GraphQLID) },
			employeeReference: { type: GraphQLString },
			departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
		},
		outputFields: {
			employee: {
				type: employeeTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => {
					const node = await employeeDataLoader.getEmployeeLoaderById().load(id);

					return {
						cursor: id,
						node,
					};
				},
			},
		},
		mutateAndGetPayload: async (args) => {
			const id = await employeeBusinessService.update(args);

			return {
				id,
			};
		},
	});

export default updateEmployee;
