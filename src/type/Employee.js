import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import SortingOptionPair from './SortingOptionPair';
import Name from './Name';
import DepartmentConnection, { getDepartments } from './DepartmentConnection';
import { NodeInterface } from '../interface';

export default new GraphQLObjectType({
	name: 'Employee',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: ({ id }) => id },
		name: { type: new GraphQLNonNull(Name), resolve: ({ name }) => name },
		departments: {
			type: DepartmentConnection.connectionType,
			args: {
				...connectionArgs,
				departmentIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
				sortingOptions: { type: new GraphQLList(new GraphQLNonNull(SortingOptionPair)) },
			},
			resolve: async (_, searchArgs, { dataLoaders }) => getDepartments(searchArgs, dataLoaders),
		},
	},
	interfaces: [NodeInterface],
});
