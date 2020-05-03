import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { NodeInterface } from '../interface';

const manufacturerType = new GraphQLObjectType({
	name: 'ActionPointStatus_ManufacturerProperties',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
		name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	},
	interfaces: [NodeInterface],
});

const getActionPointStatusFields = ({ manufacturerDataLoader }) => ({
	id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
	name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	manufacturer: {
		type: new GraphQLNonNull(manufacturerType),
		resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
	},
});

const getActionPointStatusType = ({ getActionPointStatusFields }) =>
	new GraphQLObjectType({
		name: 'ActionPointStatusProperties',
		fields: {
			...getActionPointStatusFields,
		},
		interfaces: [NodeInterface],
	});

const getActionPointStatusConnectionType = ({ getActionPointStatusType }) =>
	connectionDefinitions({
		name: 'ActionPointStatusProperties',
		nodeType: getActionPointStatusType,
		connectionFields: {
			totalCount: {
				type: GraphQLInt,
				description: 'Total number of action point statuses',
			},
		},
	});

class ActionPointStatusTypeResolver {
	constructor({ getActionPointStatusFields }) {
		this.actionPointStatusType = new GraphQLObjectType({
			name: 'ActionPointStatus',
			fields: {
				...getActionPointStatusFields,
			},
			interfaces: [NodeInterface],
		});

		this.actionPointStatusConnectionType = connectionDefinitions({
			name: 'ActionPointStatuses',
			nodeType: this.actionPointStatusType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of action point statuses',
				},
			},
		});
	}

	getType = () => this.actionPointStatusType;

	getConnectionDefinitionType = () => this.actionPointStatusConnectionType;
}

export { getActionPointStatusFields, getActionPointStatusType, getActionPointStatusConnectionType, ActionPointStatusTypeResolver };
