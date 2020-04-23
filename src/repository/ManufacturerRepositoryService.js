import admin from 'firebase-admin';
import Immutable, { List } from 'immutable';

export default class ManufacturerRepositoryService {
	getCollection = () => admin.firestore().collection('manufacturer');
	getUserCollection = () => admin.firestore().collection('user');

	create = async ({ name, userId }) => {
		const reference = await this.getCollection().add({
			name,
			user: this.getUserCollection().doc(userId),
		});

		return await this.read(reference.id);
	};

	read = async (id) => {
		const manufacturer = (await this.getCollection().doc(id).get()).data();

		if (!manufacturer) {
			return null;
		}

		return Immutable.fromJS(manufacturer)
			.set('id', id)
			.set('user', await this.readManufacturer(manufacturer.user));
	};

	update = async ({ id, name, userId }) => {
		await this.getCollection()
			.doc(id)
			.update({
				name,
				user: this.getUserCollection().doc(userId),
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

			return List(
				await Promise.all(
					manufacturers
						.map(async (manufacturer) => {
							const user = await this.readUser(manufacturer.get('user'));

							return manufacturer.set('user', user);
						})
						.toArray()
				)
			);
		}

		return Immutable.fromJS(await Promise.all(manufacturerIds.map((id) => this.read(id)))).filter((manufacturer) => manufacturer !== null);
	};

	readUser = async (userRef) => {
		const userDocumentRef = await userRef.get();
		const userData = userDocumentRef.data();

		if (!userData) {
			return null;
		}

		return Immutable.fromJS(userData).set('id', userDocumentRef.id);
	};
}
