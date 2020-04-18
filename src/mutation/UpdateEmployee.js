import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { EmployeeConnectionDefinitions, getEmployees } from '../type';
import Name from './Name';

export default mutationWithClientMutationId({
	name: 'UpdateEmployee',
	inputFields: {
		id: { type: new GraphQLNonNull(GraphQLID) },
		name: { type: new GraphQLNonNull(Name) },
		departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
	},
	outputFields: {
		employee: {
			type: EmployeeConnectionDefinitions.edgeType,
			resolve: (employee) => employee,
		},
	},
	mutateAndGetPayload: async ({ id }, { dataLoaders }) => (await getEmployees({ employeeIds: [id] }, dataLoaders)).edges[0],
});
