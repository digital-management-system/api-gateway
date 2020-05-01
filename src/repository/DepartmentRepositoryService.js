import Immutable from 'immutable';

import BaseRepositoryService from './BaseRepositoryService';

export default class DepartmentRepositoryService extends BaseRepositoryService {
	constructor() {
		const toDocument = ({ name, description, manufacturerId }) => ({
			name,
			description: description ? description : null,
			manufacturer: this.getManufacturerCollection().doc(manufacturerId),
		});

		const toObject = (document, id) =>
			Immutable.fromJS(document).set('id', id).remove('manufacturer').set('manufacturerId', document.manufacturer.id);

		const buildWhereClause = (collection, { manufacturerId, name, description }) => {
			let collectionWithWhereClause = collection;

			if (manufacturerId) {
				collectionWithWhereClause = collectionWithWhereClause.where(
					'manufacturer',
					'==',
					this.getManufacturerCollection().doc(manufacturerId)
				);
			}

			if (name) {
				collectionWithWhereClause = collectionWithWhereClause.where('name', '==', name);
			}

			if (description) {
				collectionWithWhereClause = collectionWithWhereClause.where('description', '==', description);
			}

			return collectionWithWhereClause;
		};

		super(BaseRepositoryService.collectioNames.department, toDocument, toObject, buildWhereClause);
	}
}
