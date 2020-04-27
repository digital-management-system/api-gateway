import admin from 'firebase-admin';
import Immutable, { List } from 'immutable';

export default class DepartmentRepositoryService {
	getDepartmentCollection = () => admin.firestore().collection('department');
	getManufacturerCollection = () => admin.firestore().collection('manufacturer');

	getDepartmentDocument = ({ name, description, manufacturerId }) => ({
		name,
		description: description ? description : null,
		manufacturer: this.getManufacturerCollection().doc(manufacturerId),
	});

	create = async (info) => (await this.getDepartmentCollection().add(this.getDepartmentDocument(info))).id;

	read = async (id) => {
		const department = (await this.getDepartmentCollection().doc(id).get()).data();

		if (!department) {
			return null;
		}

		return Immutable.fromJS(department).set('id', id).remove('manufacturer').set('manufacturerId', department.manufacturer.id);
	};

	update = async ({ id, ...info }) => {
		await this.getDepartmentCollection().doc(id).update(this.getDepartmentDocument(info));

		return id;
	};

	delete = async (id) => {
		await this.getDepartmentCollection().doc(id).delete();

		return id;
	};

	search = async ({ departmentIds }) => {
		let departments = List();

		if (!departmentIds || departmentIds.length === 0) {
			const snapshot = await this.getDepartmentCollection().get();

			if (!snapshot.empty) {
				snapshot.forEach((department) => {
					const departmentData = department.data();
					const manufacturerId = departmentData.manufacturer.id;

					departments = departments.push(
						Immutable.fromJS(departmentData).set('id', department.id).remove('manufacturer').set('manufacturerId', manufacturerId)
					);
				});
			}

			return departments;
		}

		return Immutable.fromJS(await Promise.all(departmentIds.map((id) => this.read(id)))).filter((department) => department !== null);
	};
}
