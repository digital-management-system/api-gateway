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
				resolve: async ({ id }) => ({
					cursor: id,
					node: await employeeDataLoader.getEmployeeLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await employeeBusinessService.create(args),
		}),
	});

export default createEmployee;
