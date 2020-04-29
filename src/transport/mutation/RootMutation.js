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
	createMSOP,
	updateMSOP,
	deleteMSOP,
	createActionReference,
	updateActionReference,
	deleteActionReference,
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
			createMSOP,
			updateMSOP,
			deleteMSOP,
			createActionReference,
			updateActionReference,
			deleteActionReference,
		},
	});

export default getRootMutation;
