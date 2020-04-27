import admin from 'firebase-admin';
import Immutable, { List } from 'immutable';

export default class ManufacturerRepositoryService {
	getManufacturerCollection = () => admin.firestore().collection('manufacturer');
	getUserCollection = () => admin.firestore().collection('user');

	create = async ({ name, userId }) => {
		const reference = await this.getManufacturerCollection().add({
			name,
			user: this.getUserCollection().doc(userId),
		});

		return reference.id;
	};

	read = async (id) => {
		const manufacturer = (await this.getManufacturerCollection().doc(id).get()).data();

		if (!manufacturer) {
			return null;
		}

		return Immutable.fromJS(manufacturer).set('id', id).remove('user').set('userId', manufacturer.user.id);
	};

	update = async ({ id, name, userId }) => {
		await this.getManufacturerCollection()
			.doc(id)
			.update({
				name,
				user: this.getUserCollection().doc(userId),
			});

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
					const manufacturerData = manufacturer.data();
					const userId = manufacturerData.user.id;

					manufacturers = manufacturers.push(
						Immutable.fromJS(manufacturerData).set('id', manufacturer.id).remove('user').set('userId', userId)
					);
				});
			}

			return manufacturers;
		}

		return Immutable.fromJS(await Promise.all(manufacturerIds.map((id) => this.read(id)))).filter((manufacturer) => manufacturer !== null);
	};
}
