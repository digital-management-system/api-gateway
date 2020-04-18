import { GraphQLObjectType } from 'graphql';
import addDepartment from './AddDepartment';
import updateDepartment from './UpdateDepartment';
import deleteDepartment from './DeleteDepartment';
import addEmployee from './AddEmployee';
import updateEmployee from './UpdateEmployee';
import deleteEmployee from './DeleteEmployee';

export default new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addDepartment,
		updateDepartment,
		deleteDepartment,
		addEmployee,
		updateEmployee,
		deleteEmployee,
	},
});
