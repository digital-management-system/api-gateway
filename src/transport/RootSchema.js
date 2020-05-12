import { GraphQLSchema } from 'graphql';

const getRootSchema = ({
	getRootQuery,
	getRootMutation,
	user, // eslint-disable-line no-unused-vars
	actionPointPriority, // eslint-disable-line no-unused-vars
	actionPointReference, // eslint-disable-line no-unused-vars
	actionPointStatus, // eslint-disable-line no-unused-vars
	actionPoint, // eslint-disable-line no-unused-vars
	department, // eslint-disable-line no-unused-vars
	employee, // eslint-disable-line no-unused-vars
	manufacturer, // eslint-disable-line no-unused-vars
	meetingDay, // eslint-disable-line no-unused-vars
	meetingDuration, // eslint-disable-line no-unused-vars
	meetingFrequency, // eslint-disable-line no-unused-vars
	msop, // eslint-disable-line no-unused-vars
	registeredUser, // eslint-disable-line no-unused-vars
}) =>
	new GraphQLSchema({
		query: getRootQuery,
		mutation: getRootMutation,
	});

export default getRootSchema;
