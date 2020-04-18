import { GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import RelayHelper from './RelayHelper';
import Common from './Common';
import Department from './Department';

export const getDepartments = async (searchArgs, { departmentLoaderById }) => {
	const { departmentIds } = searchArgs;
	const departments = await departmentLoaderById.loadMany(departmentIds);
	const totalCount = departments.length;

	if (totalCount === 0) {
		return Common.getEmptyResult();
	}

	const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, totalCount, 10, 1000);

	return Common.convertResultsToRelayConnectionResponse(departments, skip, limit, totalCount, hasNextPage, hasPreviousPage);
};

export default connectionDefinitions({
	connectionFields: {
		totalCount: {
			type: GraphQLInt,
			description: 'Total number of departments',
		},
	},
	name: 'DepartmentType',
	nodeType: Department,
});
