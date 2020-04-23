import admin from 'firebase-admin';
import Immutable, { List, Set } from 'immutable';

export default class EmployeeRepositoryService {
	create = async ({ email, employeeReference, departmentIds }) => {
		const departments = departmentIds ? Set(departmentIds).map((departmentId) => this.getDepartmentCollection().doc(departmentId)) : Set();
		const reference = await this.getCollection().add({
			email,
			employeeReference,
			departments: departments.toJS(),
		});

		return await this.read(reference.id);
	};

	read = async (id) => {
		const employee = (await this.getCollection().doc(id).get()).data();

		if (!employee) {
			return null;
		}

		return Immutable.fromJS(employee)
			.set('id', id)
			.set('departments', await this.readDepartments(employee.departments));
	};

	update = async ({ id, email, employeeReference, departmentIds }) => {
		const departments = departmentIds ? Set(departmentIds).map((departmentId) => this.getDepartmentCollection().doc(departmentId)) : Set();

		await this.getCollection().doc(id).update({
			email,
			employeeReference,
			departments: departments.toJS(),
		});

		return await this.read(id);
	};

	delete = async (id) => {
		await this.getCollection().doc(id).delete();

		return id;
	};

	search = async ({ employeeIds }) => {
		let employees = List();

		if (!employeeIds || employeeIds.length === 0) {
			const snapshot = await this.getCollection().get();

			if (!snapshot.empty) {
				snapshot.forEach((employee) => {
					employees = employees.push(Immutable.fromJS(employee.data()).set('id', employee.id));
				});
			}

			return List(
				await Promise.all(
					employees
						.map(async (employee) => {
							const departments = await this.readDepartments(employee.get('departments'));

							return employee.set('departments', departments);
						})
						.toArray()
				)
			);
		}

		return Immutable.fromJS(await Promise.all(employeeIds.map((id) => this.read(id)))).filter((employee) => employee !== null);
	};

	getCollection = () => admin.firestore().collection('employee');
	getDepartmentCollection = () => admin.firestore().collection('department');

	readDepartments = async (departmentRefs) =>
		List(
			await Promise.all(
				departmentRefs.map(async (departmentRef) => {
					const departmentDocumentRef = await departmentRef.get();
					const departmentData = departmentDocumentRef.data();

					if (!departmentData) {
						return null;
					}

					return Immutable.fromJS(departmentData).set('id', departmentDocumentRef.id);
				})
			)
		).filter((department) => department !== null);
}
