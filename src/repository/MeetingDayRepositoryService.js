import Immutable from 'immutable';

import BaseRepositoryService from './BaseRepositoryService';

export default class MeetingDayRepositoryService extends BaseRepositoryService {
	constructor() {
		const toDocument = ({ name, manufacturerId }) => ({
			manufacturer: this.getManufacturerCollection().doc(manufacturerId),
			name,
		});

		const toObject = (document, id) =>
			Immutable.fromJS(document).set('id', id).remove('manufacturer').set('manufacturerId', document.manufacturer.id);

		const buildWhereClause = (collection, { manufacturerId, name }) => {
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

			return collectionWithWhereClause;
		};

		super(BaseRepositoryService.collectioNames.meetingDay, toDocument, toObject, buildWhereClause);
	}
}
