import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateEmployee = ({ employee, employeeBusinessService, employeeDataLoader }) =>
	mutationWithClientMutationId({
		name: 'UpdateEmployee',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
			employeeReference: { type: GraphQLString },
			position: { type: GraphQLString },
			mobile: { type: GraphQLString },
			userId: { type: new GraphQLNonNull(GraphQLID) },
			departmentIds: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) },
			reportingToEmployeeId: { type: GraphQLID },
		},
		outputFields: {
			employee: {
				type: employee.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => ({
					cursor: id,
					node: await employeeDataLoader.getEmployeeLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await employeeBusinessService.update(args),
		}),
	});

export default updateEmployee;
