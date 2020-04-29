import Immutable, { List } from 'immutable';

import BaseRepositoryService from './BaseRepositoryService';

export default class ActionReferenceRepositoryService extends BaseRepositoryService {
	create = async (info) => (await this.getActionReferenceCollection().add(this.getActionReferenceDocument(info))).id;

	read = async (id) => {
		const actionReference = (await this.getActionReferenceCollection().doc(id).get()).data();

		return actionReference ? this.createReturnObject(actionReference, id) : null;
	};

	update = async ({ id, ...info }) => {
		await this.getActionReferenceCollection().doc(id).update(this.getActionReferenceDocument(info));

		return id;
	};

	delete = async (id) => {
		await this.getActionReferenceCollection().doc(id).delete();

		return id;
	};

	search = async ({ actionReferenceIds }) => {
		let actionReferences = List();

		if (!actionReferenceIds || actionReferenceIds.length === 0) {
			const snapshot = await this.getActionReferenceCollection().get();

			if (!snapshot.empty) {
				snapshot.forEach((actionReference) => {
					actionReferences = actionReferences.push(this.createReturnObject(actionReference.data(), actionReference.id));
				});
			}

			return actionReferences;
		}

		return Immutable.fromJS(await Promise.all(actionReferenceIds.map((id) => this.read(id)))).filter(
			(actionReference) => actionReference !== null
		);
	};

	getActionReferenceDocument = ({ name, manufacturerId }) => ({
		name,
		manufacturer: this.getManufacturerCollection().doc(manufacturerId),
	});

	createReturnObject = (actionReference, id) =>
		Immutable.fromJS(actionReference).set('id', id).remove('manufacturer').set('manufacturerId', actionReference.manufacturer.id);
}
