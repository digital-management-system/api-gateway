import { GraphQLEnumType, GraphQLInputObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

const sortingDirection = new GraphQLEnumType({
	name: 'SortingDirection',
	values: {
		Ascending: {
			value: 0,
		},
		Descending: {
			value: 1,
		},
	},
});

export default new GraphQLInputObjectType({
	name: 'SortingOptionPair',
	fields: () => ({
		name: { type: new GraphQLNonNull(GraphQLString) },
		direction: { type: new GraphQLNonNull(sortingDirection) },
	}),
});
