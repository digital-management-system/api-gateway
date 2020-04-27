import { GraphQLList, GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import { NodeInterface } from '../interface';
import RelayHelper from './RelayHelper';
import Common from './Common';
import MSOPMeetingFrequency from './MSOPMeetingFrequency';
import MSOPMeetingDay from './MSOPMeetingDay';

export default class MSOPTypeResolver {
	constructor({ msopBusinessService, departmentTypeResolver, departmentDataLoader, employeeTypeResolver, employeeDataLoader }) {
		this.msopBusinessService = msopBusinessService;

		this.msopType = new GraphQLObjectType({
			name: 'MSOP',
			fields: {
				id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
				meetingName: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('meetingName') },
				meetingDuration: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('meetingDuration') },
				frequency: { type: new GraphQLNonNull(MSOPMeetingFrequency), resolve: (_) => _.get('Frequency') },
				meetingDays: { type: new GraphQLList(MSOPMeetingDay), resolve: (_) => _.get('meetingDays').toArray() },
				agendas: { type: GraphQLString, resolve: (_) => _.get('agendas') },
				department: {
					type: new GraphQLNonNull(departmentTypeResolver.getType()),
					resolve: async (_) => departmentDataLoader.getDepartmentLoaderById().load(_.get('departmentId')),
				},
				chairPersonEmployee: {
					type: new GraphQLNonNull(employeeTypeResolver.getType()),
					resolve: async (_) => employeeDataLoader.getEmployeeLoaderById().load(_.get('chairPersonEmployeeId')),
				},
				actionLogSecretaryEmployee: {
					type: new GraphQLNonNull(employeeTypeResolver.getType()),
					resolve: async (_) => employeeDataLoader.getEmployeeLoaderById().load(_.get('actionLogSecretaryEmployeeId')),
				},
				attendees: {
					type: new GraphQLNonNull(new GraphQLList(employeeTypeResolver.getType())),
					resolve: async (_) => employeeDataLoader.getEmployeeLoaderById().loadMany(_.get('attendeeIds').toArray()),
				},
			},
			interfaces: [NodeInterface],
		});
		this.msopConnectionType = connectionDefinitions({
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of MSOPs',
				},
			},
			name: 'MSOPType',
			nodeType: this.msopType,
		});
	}

	getType = () => this.msopType;

	getConnectionDefinitionType = () => this.msopConnectionType;

	getMSOPs = async (searchArgs) => {
		const { msopIds } = searchArgs;
		const msops = await this.msopBusinessService.search({ msopIds });
		const totalCount = msops.length;

		if (totalCount === 0) {
			return Common.getEmptyResult();
		}

		const { limit, skip, hasNextPage, hasPreviousPage } = RelayHelper.getLimitAndSkipValue(searchArgs, totalCount, 10, 1000);

		return Common.convertResultsToRelayConnectionResponse(msops, skip, limit, totalCount, hasNextPage, hasPreviousPage);
	};
}
