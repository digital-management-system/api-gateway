import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const updateMSOP = ({ msop, msopBusinessService, msopDataLoader }) =>
	mutationWithClientMutationId({
		name: 'UpdateMSOP',
		inputFields: {
			id: { type: new GraphQLNonNull(GraphQLID) },
			manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
			meetingName: { type: new GraphQLNonNull(GraphQLString) },
			durationId: { type: new GraphQLNonNull(GraphQLID) },
			frequencyId: { type: new GraphQLNonNull(GraphQLID) },
			meetingDayIds: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) },
			agendas: { type: GraphQLString },
			departmentId: { type: new GraphQLNonNull(GraphQLID) },
			chairPersonEmployeeId: { type: new GraphQLNonNull(GraphQLID) },
			actionLogSecretaryEmployeeId: { type: new GraphQLNonNull(GraphQLID) },
			attendeeIds: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) },
		},
		outputFields: {
			msop: {
				type: msop.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => ({
					cursor: id,
					node: await msopDataLoader.getMSOPLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await msopBusinessService.update(args),
		}),
	});

export default updateMSOP;
