import { GraphQLNonNull, GraphQLID, GraphQLList, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

const createMSOP = ({ msopTypeResolver, msopBusinessService, msopDataLoader }) =>
	mutationWithClientMutationId({
		name: 'CreateMSOP',
		inputFields: {
			manufacturerId: { type: new GraphQLNonNull(GraphQLID) },
			meetingName: { type: new GraphQLNonNull(GraphQLString) },
			meetingDuration: { type: new GraphQLNonNull(GraphQLString) },
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
				type: msopTypeResolver.getConnectionDefinitionType().edgeType,
				resolve: async ({ id }) => ({
					cursor: id,
					node: await msopDataLoader.getMSOPLoaderById().load(id),
				}),
			},
		},
		mutateAndGetPayload: async (args) => ({
			id: await msopBusinessService.create(args),
		}),
	});

export default createMSOP;
