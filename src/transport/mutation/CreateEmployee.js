import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import cuid from 'cuid';
import Name from './Name';

const createEmployee = ({ employeeTypeResolver }) =>
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
		mutateAndGetPayload: async (args, { dataLoaders }) =>
			(await employeeTypeResolver.getEmployees({ employeeIds: [cuid()] }, dataLoaders)).edges[0],
	});

export default createEmployee;
