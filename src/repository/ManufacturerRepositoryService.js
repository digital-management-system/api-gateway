import Immutable, { List } from 'immutable';

import BaseRepositoryService from './BaseRepositoryService';

export default class ManufacturerRepositoryService extends BaseRepositoryService {
	create = async (info) => (await this.getManufacturerCollection().add(this.getManufacturerDocument(info))).id;

	read = async (id) => {
		const manufacturer = (await this.getManufacturerCollection().doc(id).get()).data();

		return manufacturer ? this.createReturnObject(manufacturer, id) : null;
	};

	update = async ({ id, ...info }) => {
		await this.getManufacturerCollection().doc(id).update(this.getManufacturerDocument(info));

		return id;
	};

	delete = async (id) => {
		await this.getManufacturerCollection().doc(id).delete();

		return id;
	};

	search = async ({ manufacturerIds }) => {
		let manufacturers = List();

		if (!manufacturerIds || manufacturerIds.length === 0) {
			const snapshot = await this.getManufacturerCollection().get();

			if (!snapshot.empty) {
				snapshot.forEach((manufacturer) => {
					manufacturers = manufacturers.push(this.createReturnObject(manufacturer.data(), manufacturer.id));
				});
			}

			return manufacturers;
		}

		return Immutable.fromJS(await Promise.all(manufacturerIds.map((id) => this.read(id)))).filter((manufacturer) => manufacturer !== null);
	};

	getManufacturerDocument = ({ name, userId }) => ({
		name,
		user: this.getUserCollection().doc(userId),
	});

	createReturnObject = (manufacturer, id) => Immutable.fromJS(manufacturer).set('id', id).remove('user').set('userId', manufacturer.user.id);
}
