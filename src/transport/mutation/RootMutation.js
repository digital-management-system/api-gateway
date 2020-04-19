import { GraphQLObjectType } from 'graphql';

const getRootMutation = ({ createDepartment, updateDepartment, deleteDepartment, createEmployee, updateEmployee, deleteEmployee }) =>
	new GraphQLObjectType({
		name: 'Mutation',
		fields: {
			createDepartment,
			updateDepartment,
			deleteDepartment,
			createEmployee,
			updateEmployee,
			deleteEmployee,
		},
	});

export default getRootMutation;
