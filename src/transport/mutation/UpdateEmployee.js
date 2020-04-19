import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import Name from './Name';

const updateEmployee = ({ employeeResolver }) =>
	mutationWithClientMutationId({
		name: 'UpdateEmployee',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			name: { type: new GraphQLNonNull(Name) },
			departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
		},
		outputFields: {
			employee: {
				type: employeeResolver.getConnectionDefinitionType().edgeType,
				resolve: (employee) => employee,
			},
		},
		mutateAndGetPayload: async ({ id }, { dataLoaders }) =>
			(await employeeResolver.getEmployees({ employeeIds: [{ id }] }, dataLoaders)).edges[0],
	});

export default updateEmployee;
