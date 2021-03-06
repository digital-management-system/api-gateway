import { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateActionPoint = ({ actionPoint, actionPointBusinessService, actionPointDataLoader }) =>
	mutationWithClientMutationId({
		name: 'UpdateActionPoint',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
			msopId: { type: new GraphQLNonNull(GraphQLID) },
			assigneeId: { type: new GraphQLNonNull(GraphQLID) },
			departmentId: { type: new GraphQLNonNull(GraphQLID) },
			assignedDate: { type: new GraphQLNonNull(GraphQLString) },
			dueDate: { type: GraphQLString },
			priorityId: { type: new GraphQLNonNull(GraphQLID) },
			statusId: { type: new GraphQLNonNull(GraphQLID) },
			actionReferenceIds: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) },
			comments: { type: GraphQLString },
		},
		outputFields: {
			actionPoint: {
				type: actionPoint.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => ({
					cursor: id,
					node: await actionPointDataLoader.getActionPointLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await actionPointBusinessService.update(args),
		}),
	});

export default updateActionPoint;
