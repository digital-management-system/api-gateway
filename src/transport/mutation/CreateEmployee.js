import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createEmployee = ({ employeeTypeResolver, employeeBusinessService, employeeDataLoader }) =>
	mutationWithClientMutationId({
		name: 'CreateEmployee',
		inputFields: {
			employeeReference: { type: GraphQLString },
			position: { type: GraphQLString },
			mobile: { type: GraphQLString },
			userId: { type: new GraphQLNonNull(GraphQLID) },
			departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
			reportingToEmployeeId: { type: GraphQLID },
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
			const id = await employeeBusinessService.create(args);

			return {
				id,
			};
		},
	});

export default createEmployee;
