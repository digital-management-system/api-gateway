import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import cuid from 'cuid';
import { EmployeeConnectionDefinitions, getEmployees } from '../type';
import Name from './Name';

export default mutationWithClientMutationId({
	name: 'AddEmployee',
	inputFields: {
		name: { type: new GraphQLNonNull(Name) },
		departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
	},
	outputFields: {
		employee: {
			type: EmployeeConnectionDefinitions.edgeType,
			resolve: (employee) => employee,
		},
	},
	mutateAndGetPayload: async (args, { dataLoaders }) => (await getEmployees({ employeeIds: [cuid()] }, dataLoaders)).edges[0],
});
