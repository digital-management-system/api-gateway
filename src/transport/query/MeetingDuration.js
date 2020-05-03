import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { NodeInterface } from '../interface';

const manufacturerType = new GraphQLObjectType({
	name: 'MeetingDuration_ManufacturerProperties',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
		name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	},
	interfaces: [NodeInterface],
});

const getMeetingDurationFields = ({ manufacturerDataLoader }) => ({
	id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
	name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	manufacturer: {
		type: new GraphQLNonNull(manufacturerType),
		resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
	},
});

const getMeetingDurationType = ({ getMeetingDurationFields }) =>
	new GraphQLObjectType({
		name: 'MeetingDurationProperties',
		fields: {
			...getMeetingDurationFields,
		},
		interfaces: [NodeInterface],
	});

const getMeetingDurationConnectionType = ({ getMeetingDurationType }) =>
	connectionDefinitions({
		name: 'MeetingDurationsProperties',
		nodeType: getMeetingDurationType,
		connectionFields: {
			totalCount: {
				type: GraphQLInt,
				description: 'Total number of meeting durations',
			},
		},
	});

class MeetingDurationTypeResolver {
	constructor({ getMeetingDurationFields }) {
		this.meetingDurationType = new GraphQLObjectType({
			name: 'MeetingDuration',
			fields: {
				...getMeetingDurationFields,
			},
			interfaces: [NodeInterface],
		});

		this.meetingDurationConnectionType = connectionDefinitions({
			name: 'MeetingDurations',
			nodeType: this.meetingDurationType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of meeting durations',
				},
			},
		});
	}

	getType = () => this.meetingDurationType;

	getConnectionDefinitionType = () => this.meetingDurationConnectionType;
}

export { getMeetingDurationFields, getMeetingDurationType, getMeetingDurationConnectionType, MeetingDurationTypeResolver };
