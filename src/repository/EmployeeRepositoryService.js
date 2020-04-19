import admin from 'firebase-admin';
import ObjectID from 'bson-objectid';

export default class EmployeeRepositoryService {
	create = async ({ name, departmentIds }) => {
		const id = ObjectID().toHexString();
		const document = this.getCollection().doc(id);

		await document.set({
			objectId: id,
			name,
			departmentIds,
		});

		return {
			id,
			name,
			departmentIds,
		};
	};

	read = async (id) => {
		const document = this.getCollection().doc(id);
		const { name, departmentIds } = (await document.get()).data();

		return {
			id,
			name,
			departmentIds,
		};
	};

	update = async ({ id, name, departmentIds }) => {
		const document = this.getCollection().doc(id);

		await document.update({
			objectId: id,
			name,
			departmentIds,
		});

		return {
			id,
			name,
			departmentIds,
		};
	};

	delete = async (id) => {
		const document = this.getCollection().doc(id);

		await document.delete();

		return id;
	};

	search = async ({ employeeIds }) => {
		let employees = [];

		if (!employeeIds || employeeIds.length === 0) {
			const snapshot = await this.getCollection().get();

			if (!snapshot.empty) {
				snapshot.forEach((employee) => {
					employees.push(employee.data());
				});
			}
		} else {
			return await Promise.all(employeeIds.map((id) => this.read(id)));
		}

		return employees.map((employee) => {
			employee.id = employee.objectId;

			return employee;
		});
	};

	getCollection = () => admin.firestore().collection('employee');
}