import admin from 'firebase-admin';
import Immutable, { List, Set } from 'immutable';

export default class ManufacturerRepositoryService {
	getCollection = () => admin.firestore().collection('manufacturer');
	getUserCollection = () => admin.firestore().collection('user');

	create = async ({ name, userIds }) => {
		const users = userIds ? Set(userIds).map((userId) => this.getUserCollection().doc(userId)) : Set();
		const reference = await this.getCollection().add({
			name,
			users: users.toJS(),
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
			.set('users', await this.readUsers(manufacturer.users));
	};

	update = async ({ id, name, userIds }) => {
		const users = userIds ? Set(userIds).map((userId) => this.getUserCollection().doc(userId)) : Set();

		await this.getCollection().doc(id).update({
			name,
			users: users.toJS(),
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
							const users = await this.readUsers(manufacturer.get('users'));

							return manufacturer.set('users', users);
						})
						.toArray()
				)
			);
		}

		return Immutable.fromJS(await Promise.all(manufacturerIds.map((id) => this.read(id)))).filter((manufacturer) => manufacturer !== null);
	};

	readUsers = async (userRefs) =>
		List(
			await Promise.all(
				userRefs.map(async (userRef) => {
					const userDocumentRef = await userRef.get();
					const userData = userDocumentRef.data();

					if (!userData) {
						return null;
					}

					return Immutable.fromJS(userData).set('id', userDocumentRef.id);
				})
			)
		).filter((user) => user !== null);
}
