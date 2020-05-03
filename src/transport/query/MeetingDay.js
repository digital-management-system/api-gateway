import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { NodeInterface } from '../interface';

const manufacturerType = new GraphQLObjectType({
	name: 'MeetingDay_ManufacturerProperties',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
		name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	},
	interfaces: [NodeInterface],
});

const getMeetingDayFields = ({ manufacturerDataLoader }) => ({
	id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
	name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	manufacturer: {
		type: new GraphQLNonNull(manufacturerType),
		resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
	},
});

const getMeetingDayType = ({ getMeetingDayFields }) =>
	new GraphQLObjectType({
		name: 'MeetingDayProperties',
		fields: {
			...getMeetingDayFields,
		},
		interfaces: [NodeInterface],
	});

const getMeetingDayConnectionType = ({ getMeetingDayType }) =>
	connectionDefinitions({
		name: 'MeetingDaysProperties',
		nodeType: getMeetingDayType,
		connectionFields: {
			totalCount: {
				type: GraphQLInt,
				description: 'Total number of meeting days',
			},
		},
	});

class MeetingDayTypeResolver {
	constructor({ getMeetingDayFields }) {
		this.meetingDayType = new GraphQLObjectType({
			name: 'MeetingDay',
			fields: {
				...getMeetingDayFields,
			},
			interfaces: [NodeInterface],
		});

		this.meetingDayConnectionType = connectionDefinitions({
			name: 'MeetingDays',
			nodeType: this.meetingDayType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of meeting days',
				},
			},
		});
	}

	getType = () => this.meetingDayType;

	getConnectionDefinitionType = () => this.meetingDayConnectionType;
}

export { getMeetingDayFields, getMeetingDayType, getMeetingDayConnectionType, MeetingDayTypeResolver };
