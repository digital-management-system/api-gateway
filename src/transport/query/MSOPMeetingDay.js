import { GraphQLEnumType } from 'graphql';

export default new GraphQLEnumType({
	name: 'MSOPMeetingDay',
	values: {
		Monday: {
			value: 0,
		},
		Tuesday: {
			value: 1,
		},
		Wednesday: {
			value: 2,
		},
		Thursday: {
			value: 3,
		},
		Friday: {
			value: 4,
		},
		Saturday: {
			value: 5,
		},
		Sunday: {
			value: 6,
		},
	},
});
