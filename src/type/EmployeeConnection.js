import { GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import RelayHelper from './RelayHelper';
import Common from './Common';
import Employee from './Employee';

export const getEmployees = async (searchArgs, { employeeLoaderById }) => {
	const { employeeIds } = searchArgs;

	if (employeeIds && employeeIds.length === 0) {
		return Common.getEmptyResult();
	}

	const employees = await employeeLoaderById.loadMany(employeeIds);
	const totalCount = employees.length;

	if (totalCount === 0) {
		return Common.getEmptyResult();
	}

	const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, totalCount, 10, 1000);

	return Common.convertResultsToRelayConnectionResponse(employees, skip, limit, totalCount, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
	connectionFields: {
		totalCount: {
			type: GraphQLInt,
			description: 'Total number of employees',
		},
	},
	name: 'EmployeeType',
	nodeType: Employee,
});
