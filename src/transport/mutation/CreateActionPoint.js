import { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createActionPoint = ({ actionPoint, actionPointBusinessService, actionPointDataLoader }) =>
	mutationWithClientMutationId({
		name: 'CreateActionPoint',
		inputFields: {
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
			id: await actionPointBusinessService.create(args),
		}),
	});

export default createActionPoint;
