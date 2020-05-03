import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { NodeInterface } from '../interface';

const manufacturerType = new GraphQLObjectType({
	name: 'ActionPointReference_ManufacturerProperties',
	fields: {
		id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
		name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	},
	interfaces: [NodeInterface],
});

const getActionPointReferenceFields = ({ manufacturerDataLoader }) => ({
	id: { type: new GraphQLNonNull(GraphQLID), resolve: (_) => _.get('id') },
	name: { type: new GraphQLNonNull(GraphQLString), resolve: (_) => _.get('name') },
	manufacturer: {
		type: new GraphQLNonNull(manufacturerType),
		resolve: async (_) => manufacturerDataLoader.getManufacturerLoaderById().load(_.get('manufacturerId')),
	},
});

const getActionPointReferenceType = ({ getActionPointReferenceFields }) =>
	new GraphQLObjectType({
		name: 'ActionPointReferenceProperties',
		fields: {
			...getActionPointReferenceFields,
		},
		interfaces: [NodeInterface],
	});

const getActionPointReferenceConnectionType = ({ getActionPointReferenceType }) =>
	connectionDefinitions({
		name: 'ActionPointReferencesProperties',
		nodeType: getActionPointReferenceType,
		connectionFields: {
			totalCount: {
				type: GraphQLInt,
				description: 'Total number of action point references',
			},
		},
	});

class ActionPointReferenceTypeResolver {
	constructor({ getActionPointReferenceFields }) {
		this.actionPointReferenceType = new GraphQLObjectType({
			name: 'ActionPointReference',
			fields: {
				...getActionPointReferenceFields,
			},
			interfaces: [NodeInterface],
		});

		this.actionPointReferenceConnectionType = connectionDefinitions({
			name: 'ActionPointReferences',
			nodeType: this.actionPointReferenceType,
			connectionFields: {
				totalCount: {
					type: GraphQLInt,
					description: 'Total number of action point references',
				},
			},
		});
	}

	getType = () => this.actionPointReferenceType;

	getConnectionDefinitionType = () => this.actionPointReferenceConnectionType;
}

export { getActionPointReferenceFields, getActionPointReferenceType, getActionPointReferenceConnectionType, ActionPointReferenceTypeResolver };
