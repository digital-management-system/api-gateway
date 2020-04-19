import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import Name from './Name';

const updateEmployee = ({ employeeTypeResolver, employeeBusinessService }) =>
	mutationWithClientMutationId({
		name: 'UpdateEmployee',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
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
			const { id, name, departmentIds } = await employeeBusinessService.update(args);

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

export default updateEmployee;
