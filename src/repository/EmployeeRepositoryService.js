import admin from 'firebase-admin';
import ObjectID from 'bson-objectid';

export default class EmployeeRepositoryService {
	create = async ({ email, employeeReference, departmentIds }) => {
		const id = ObjectID().toHexString();

		await this.getCollection().doc(id).set({
			objectId: id,
			email,
			employeeReference,
			departmentIds,
		});

		return {
			id,
			email,
			employeeReference,
			departmentIds,
		};
	};

	read = async (id) => {
		const { email, employeeReference, departmentIds } = (await this.getCollection().doc(id).get()).data();

		return {
			id,
			email,
			employeeReference,
			departmentIds,
		};
	};

	update = async ({ id, email, employeeReference, departmentIds }) => {
		await this.getCollection().doc(id).update({
			objectId: id,
			email,
			employeeReference,
			departmentIds,
		});

		return {
			id,
			email,
			employeeReference,
			departmentIds,
		};
	};

	delete = async (id) => {
		await this.getCollection().doc(id).delete();

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
