import Immutable, { List } from 'immutable';

import BaseRepositoryService from './BaseRepositoryService';

export default class DepartmentRepositoryService extends BaseRepositoryService {
	create = async (info) => (await this.getDepartmentCollection().add(this.getDepartmentDocument(info))).id;

	read = async (id) => {
		const department = (await this.getDepartmentCollection().doc(id).get()).data();

		return department ? this.createReturnObject(department, id) : null;
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
					departments = departments.push(this.createReturnObject(department.data(), department.id));
				});
			}

			return departments;
		}

		return Immutable.fromJS(await Promise.all(departmentIds.map((id) => this.read(id)))).filter((department) => department !== null);
	};

	getDepartmentDocument = ({ name, description, manufacturerId }) => ({
		name,
		description: description ? description : null,
		manufacturer: this.getManufacturerCollection().doc(manufacturerId),
	});

	createReturnObject = (department, id) =>
		Immutable.fromJS(department).set('id', id).remove('manufacturer').set('manufacturerId', department.manufacturer.id);
}
