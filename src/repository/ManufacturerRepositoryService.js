import Immutable from 'immutable';

import BaseRepositoryService from './BaseRepositoryService';

export default class ManufacturerRepositoryService extends BaseRepositoryService {
	constructor() {
		const toDocument = ({ name, userId }) => ({
			name,
			user: this.getUserCollection().doc(userId),
		});

		const toObject = (document, id) => Immutable.fromJS(document).set('id', id).remove('user').set('userId', document.user.id);

		const buildWhereClause = (collection, { userId, name }) => {
			let collectionWithWhereClause = collection;

			if (userId) {
				collectionWithWhereClause = collectionWithWhereClause.where('user', '==', this.getUserCollection().doc(userId));
			}

			if (name) {
				collectionWithWhereClause = collectionWithWhereClause.where('name', '==', name);
			}

			return collectionWithWhereClause;
		};

		super(BaseRepositoryService.collectioNames.manufacturer, toDocument, toObject, buildWhereClause);
	}
}
