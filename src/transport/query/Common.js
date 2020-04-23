import { Range } from 'immutable';

export default class Common {
	static getEmptyResult = () => ({
		edges: [],
		count: 0,
		pageInfo: {
			startCursor: 'cursor not available',
			endCursor: 'cursor not available',
			hasPreviousPage: false,
			hasNextPage: false,
		},
	});

	static convertResultsToRelayConnectionResponse = (results, skip, limit, count, hasNextPage, hasPreviousPage) => {
		const indexedResults = results.zip(Range(skip, skip + limit));
		const edges = indexedResults.map((indexedResult) => ({
			node: indexedResult[0],
			cursor: indexedResult[1] + 1,
		}));

		const firstEdge = edges.first();
		const lastEdge = edges.last();

		return {
			edges: edges.toArray(),
			count,
			pageInfo: {
				startCursor: firstEdge ? firstEdge.cursor : 'cursor not available',
				endCursor: lastEdge ? lastEdge.cursor : 'cursor not available',
				hasPreviousPage,
				hasNextPage,
			},
		};
	};
}
