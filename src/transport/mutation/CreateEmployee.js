import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import Name from './Name';

const createEmployee = ({ employeeTypeResolver, employeeBusinessService }) =>
	mutationWithClientMutationId({
		name: 'CreateEmployee',
		inputFields: {
			name: { type: new GraphQLNonNull(Name) },
			departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
		},
		outputFields: {
			employee: {
				type: employeeTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: (employee) => employee,
			},
		},
		mutateAndGetPayload: async (args) => {
			const { id, name, departmentIds } = await employeeBusinessService.create(args);

			return {
				cursor: id,
				node: {
					id,
					name,
					departmentIds,
				},
			};
		},
	});

export default createEmployee;
