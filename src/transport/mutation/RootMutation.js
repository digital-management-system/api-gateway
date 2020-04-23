import { GraphQLObjectType } from 'graphql';

const getRootMutation = ({
	createManufacturer,
	updateManufacturer,
	deleteManufacturer,
	createDepartment,
	updateDepartment,
	deleteDepartment,
	createEmployee,
	updateEmployee,
	deleteEmployee,
}) =>
	new GraphQLObjectType({
		name: 'Mutation',
		fields: {
			createManufacturer,
			updateManufacturer,
			deleteManufacturer,
			createDepartment,
			updateDepartment,
			deleteDepartment,
			createEmployee,
			updateEmployee,
			deleteEmployee,
		},
	});

export default getRootMutation;
