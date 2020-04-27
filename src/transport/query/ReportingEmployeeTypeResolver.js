import { GraphQLID, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { NodeInterface } from '../interface';

export default class ReportingEmployeeTypeResolver {
	constructor({ registeredUserTypeResolver, departmentTypeResolver, userDataLoader, departmentDataLoader }) {
		this.reportingEmployeeType = new GraphQLObjectType({
			name: 'ReportingEmployee',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				employeeReference: { type: GraphQLString, resolve: (_) => _.get('employeeReference') },
				position: { type: GraphQLString, resolve: (_) => _.get('position') },
				mobile: { type: GraphQLString, resolve: (_) => _.get('mobile') },
				user: {
					type: new GraphQLNonNull(registeredUserTypeResolver.getType()),
					resolve: async (_) => userDataLoader.getUserLoaderById().load(_.get('userId')),
				},
				departments: {
					type: new GraphQLNonNull(new GraphQLList(departmentTypeResolver.getType())),
					resolve: async (_) => departmentDataLoader.getDepartmentLoaderById().loadMany(_.get('departmentIds').toArray()),
				},
			},
			interfaces: [NodeInterface],
		});
	}

	getType = () => this.reportingEmployeeType;
}
