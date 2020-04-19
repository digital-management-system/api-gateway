import admin from 'firebase-admin';
import ObjectID from 'bson-objectid';

export default class DepartmentRepositoryService {
	create = async ({ name, description }) => {
		const id = ObjectID().toHexString();
		const document = this.getCollection().doc(id);

		await document.set({
			objectId: id,
			name,
			description,
		});

		return {
			id,
			name,
			description,
		};
	};

	read = async (id) => {
		const document = this.getCollection().doc(id);
		const { name, description } = (await document.get()).data();

		return {
			id,
			name,
			description,
		};
	};

	update = async ({ id, name, description }) => {
		const document = this.getCollection().doc(id);

		await document.update({
			objectId: id,
			name,
			description,
		});

		return {
			id,
			name,
			description,
		};
	};

	delete = async (id) => {
		const document = this.getCollection().doc(id);

		await document.delete();

		return id;
	};

	search = async ({ departmentIds }) => {
		let documents = [];

		if (!departmentIds || departmentIds.length === 0) {
			const snapshot = await this.getCollection().get();

			if (!snapshot.empty) {
				snapshot.forEach((document) => {
					documents.push(document.data());
				});
			}
		} else {
			return await Promise.all(departmentIds.map((id) => this.read(id)));
		}

		return documents.map((document) => {
			document.id = document.objectId;

			return document;
		});
	};

	getCollection = () => admin.firestore().collection('department');
}
