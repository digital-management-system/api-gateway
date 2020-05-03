import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { NodeInterface } from '../interface';

const manufacturerType = new GraphQLObjectType({
	name: 'MeetingFrequency_ManufacturerProperties',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
		name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	},
	interfaces: [NodeInterface],
});

const getMeetingFrequencyFields = ({ manufacturerDataLoader }) => ({
	id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
	name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	manufacturer: {
		type: new GraphQLNonNull(manufacturerType),
		resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
	},
});

const getMeetingFrequencyType = ({ getMeetingFrequencyFields }) =>
	new GraphQLObjectType({
		name: 'MeetingFrequencyProperties',
		fields: {
			...getMeetingFrequencyFields,
		},
		interfaces: [NodeInterface],
	});

const getMeetingFrequencyConnectionType = ({ getMeetingFrequencyType }) =>
	connectionDefinitions({
		name: 'MeetingFrequenciesProperties',
		nodeType: getMeetingFrequencyType,
		connectionFields: {
			totalCount: {
				type: GraphQLInt,
				description: 'Total number of meeting frequencies',
			},
		},
	});

class MeetingFrequencyTypeResolver {
	constructor({ getMeetingFrequencyFields }) {
		this.meetingFrequencyType = new GraphQLObjectType({
			name: 'MeetingFrequency',
			fields: {
				...getMeetingFrequencyFields,
			},
			interfaces: [NodeInterface],
		});

		this.meetingFrequencyConnectionType = connectionDefinitions({
			name: 'MeetingFrequencies',
			nodeType: this.meetingFrequencyType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of meeting frequencies',
				},
			},
		});
	}

	getType = () => this.meetingFrequencyType;

	getConnectionDefinitionType = () => this.meetingFrequencyConnectionType;
}

export { getMeetingFrequencyFields, getMeetingFrequencyType, getMeetingFrequencyConnectionType, MeetingFrequencyTypeResolver };
