import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createEmployee = ({ employeeTypeResolver, employeeBusinessService }) =>
	mutationWithClientMutationId({
		name: 'CreateEmployee',
		inputFields: {
			userId: { type: new GraphQLNonNull(GraphQLID) },
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
			const node = await employeeBusinessService.create(args);

			return {
				cursor: node.get('id'),
				node,
			};
		},
	});

export default createEmployee;
