import { GraphQLEnumType } from 'graphql';

export default new GraphQLEnumType({
	name: 'MSOPMeetingFrequency',
	values: {
		Daily: {
			value: 0,
		},
		Weekly: {
			value: 1,
		},
		Monthly: {
			value: 2,
		},
	},
});
