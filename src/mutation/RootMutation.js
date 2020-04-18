import { GraphQLObjectType } from 'graphql';
import createDepartment from './CreateDepartment';
import updateDepartment from './UpdateDepartment';
import deleteDepartment from './DeleteDepartment';
import createEmployee from './CreateEmployee';
import updateEmployee from './UpdateEmployee';
import deleteEmployee from './DeleteEmployee';

export default new GraphQLObjectType({
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
