import admin from 'firebase-admin';
import Immutable, { List } from 'immutable';

export default class DepartmentRepositoryService {
	getCollection = () => admin.firestore().collection('department');
	getManufacturerCollection = () => admin.firestore().collection('manufacturer');

	create = async ({ name, description, manufacturerId }) => {
		const reference = await this.getCollection().add({
			name,
			description: description ? description : null,
			manufacturer: this.getManufacturerCollection().doc(manufacturerId),
		});

		return await this.read(reference.id);
	};

	read = async (id) => {
		const department = (await this.getCollection().doc(id).get()).data();

		if (!department) {
			return null;
		}

		return Immutable.fromJS(department)
			.set('id', id)
			.set('manufacturer', await this.readManufacturer(department.manufacturer));
	};

	update = async ({ id, name, description, manufacturerId }) => {
		await this.getCollection()
			.doc(id)
			.update({
				name,
				description: description ? description : null,
				manufacturer: this.getManufacturerCollection().doc(manufacturerId),
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

			return List(
				await Promise.all(
					departments
						.map(async (department) => {
							const manufacturer = await this.readManufacturer(department.get('manufacturer'));

							return department.set('manufacturer', manufacturer);
						})
						.toArray()
				)
			);
		}

		return Immutable.fromJS(await Promise.all(departmentIds.map((id) => this.read(id)))).filter((department) => department !== null);
	};

	readManufacturer = async (manufacturerRef) => {
		const manufacturerDocumentRef = await manufacturerRef.get();
		const manufacturerData = manufacturerDocumentRef.data();

		if (!manufacturerData) {
			return null;
		}

		return Immutable.fromJS(manufacturerData).set('id', manufacturerDocumentRef.id);
	};
}
