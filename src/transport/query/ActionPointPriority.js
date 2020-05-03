import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { NodeInterface } from '../interface';

const manufacturerType = new GraphQLObjectType({
	name: 'ActionPointPriority_ManufacturerProperties',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
		name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	},
	interfaces: [NodeInterface],
});

const getActionPointPriorityFields = ({ manufacturerDataLoader }) => ({
	id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
	name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	manufacturer: {
		type: new GraphQLNonNull(manufacturerType),
		resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
	},
});

const getActionPointPriorityType = ({ getActionPointPriorityFields }) =>
	new GraphQLObjectType({
		name: 'ActionPointPriorityProperties',
		fields: {
			...getActionPointPriorityFields,
		},
		interfaces: [NodeInterface],
	});

const getActionPointPriorityConnectionType = ({ getActionPointPriorityType }) =>
	connectionDefinitions({
		name: 'ActionPointPrioritiesProperties',
		nodeType: getActionPointPriorityType,
		connectionFields: {
			totalCount: {
				type: GraphQLInt,
				description: 'Total number of action point priorities',
			},
		},
	});

class ActionPointPriorityTypeResolver {
	constructor({ getActionPointPriorityFields }) {
		this.actionPointPriorityType = new GraphQLObjectType({
			name: 'ActionPointPriority',
			fields: {
				...getActionPointPriorityFields,
			},
			interfaces: [NodeInterface],
		});

		this.actionPointPriorityConnectionType = connectionDefinitions({
			name: 'ActionPointPriorities',
			nodeType: this.actionPointPriorityType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of action point priorities',
				},
			},
		});
	}

	getType = () => this.actionPointPriorityType;

	getConnectionDefinitionType = () => this.actionPointPriorityConnectionType;
}

export { getActionPointPriorityFields, getActionPointPriorityType, getActionPointPriorityConnectionType, ActionPointPriorityTypeResolver };
