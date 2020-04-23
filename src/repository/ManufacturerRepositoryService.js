import admin from 'firebase-admin';
import Immutable, { List } from 'immutable';

export default class ManufacturerRepositoryService {
	create = async ({ name }) => {
		const reference = await this.getCollection().add({
			name,
		});

		return await this.read(reference.id);
	};

	read = async (id) => {
		const manufacturer = (await this.getCollection().doc(id).get()).data();

		if (!manufacturer) {
			return null;
		}

		return Immutable.fromJS(manufacturer).set('id', id);
	};

	update = async ({ id, name }) => {
		await this.getCollection().doc(id).update({
			name,
		});

		return await this.read(id);
	};

	delete = async (id) => {
		await this.getCollection().doc(id).delete();

		return id;
	};

	search = async ({ manufacturerIds }) => {
		let manufacturers = List();

		if (!manufacturerIds || manufacturerIds.length === 0) {
			const snapshot = await this.getCollection().get();

			if (!snapshot.empty) {
				snapshot.forEach((manufacturer) => {
					manufacturers = manufacturers.push(Immutable.fromJS(manufacturer.data()).set('id', manufacturer.id));
				});
			}

			return manufacturers;
		}

		return Immutable.fromJS(await Promise.all(manufacturerIds.map((id) => this.read(id)))).filter((manufacturer) => manufacturer !== null);
	};

	getCollection = () => admin.firestore().collection('manufacturer');
}
