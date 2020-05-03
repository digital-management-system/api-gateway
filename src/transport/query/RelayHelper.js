import { Range } from 'immutable';

const getEmptyResult = () => ({
	edges: [],
	count: 0,
	pageInfo: {
		startCursor: 'cursor not available',
		endCursor: 'cursor not available',
		hasPreviousPage: false,
		hasNextPage: false,
	},
});

const convertResultsToRelayConnectionResponse = (results, skip, limit, count, hasNextPage, hasPreviousPage) => {
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

const getLimitAndSkipValue = (searchCriteria, count, defaultPageSize, maximumPageSize) => {
	const after = searchCriteria.after;
	const before = searchCriteria.before;
	let first = searchCriteria.first;
	let last = searchCriteria.last;

	if ((first || after) && (last || before)) {
		throw new Error('Mixing first and after with last and before is not supported.');
	}

	let limit;
	let skip;

	if (first || after) {
		if (!first) {
			first = defaultPageSize;
		}
	} else if (last || before) {
		if (!last) {
			last = defaultPageSize;
		}
	} else {
		first = defaultPageSize;
	}

	if (first > maximumPageSize) {
		first = maximumPageSize;
	}

	if (last > maximumPageSize) {
		last = maximumPageSize;
	}

	if (first && after) {
		const afterValue = parseInt(after, 10);

		limit = first;
		skip = afterValue;
	} else if (first) {
		limit = first;
		skip = 0;
	} else if (last && before) {
		const beforeValue = parseInt(before, 10);

		limit = last;
		skip = beforeValue.idx - last;

		if (skip < 0) {
			skip = 0;
		}
	} else if (last) {
		limit = last;
		skip = 0;
	}

	const hasNextPage = skip + limit < count;
	const hasPreviousPage = skip !== 0;

	return {
		limit,
		skip,
		hasNextPage,
		hasPreviousPage,
	};
};

const convertToRelayConnection = () => (searchCriteria, items) => {
	if (items.length === 0) {
		return getEmptyResult();
	}

	const { limit, skip, hasNextPage, hasPreviousPage } = getLimitAndSkipValue(searchCriteria, items.length, 10, 1000);

	return convertResultsToRelayConnectionResponse(items, skip, limit, items.length, hasNextPage, hasPreviousPage);
};

export default convertToRelayConnection;
