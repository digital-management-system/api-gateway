import admin from 'firebase-admin';
import Immutable, { List } from 'immutable';

export default class DepartmentRepositoryService {
	getCollection = () => admin.firestore().collection('department');

	create = async ({ name, description }) => {
		const reference = await this.getCollection().add({
			name,
			description,
		});

		return await this.read(reference.id);
	};

	read = async (id) => {
		const department = (await this.getCollection().doc(id).get()).data();

		if (!department) {
			return null;
		}

		return Immutable.fromJS(department).set('id', id);
	};

	update = async ({ id, name, description }) => {
		await this.getCollection().doc(id).update({
			objectId: id,
			name,
			description,
		});

		return await this.read(id);
	};

	delete = async (id) => {
		await this.getCollection().doc(id).delete();

		return id;
	};

	search = async ({ departmentIds }) => {
		let departments = List();

		if (!departmentIds || departmentIds.length === 0) {
			const snapshot = await this.getCollection().get();

			if (!snapshot.empty) {
				snapshot.forEach((department) => {
					departments = departments.push(Immutable.fromJS(department.data()).set('id', department.id));
				});
			}

			return departments;
		}

		return Immutable.fromJS(await Promise.all(departmentIds.map((id) => this.read(id)))).filter((department) => department !== null);
	};
}
