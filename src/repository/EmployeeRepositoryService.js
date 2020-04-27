import admin from 'firebase-admin';
import Immutable, { List, Set } from 'immutable';

export default class EmployeeRepositoryService {
	getEmployeeCollection = () => admin.firestore().collection('employee');
	getDepartmentCollection = () => admin.firestore().collection('department');
	getUserCollection = () => admin.firestore().collection('user');

	create = async ({ employeeReference, userId, departmentIds }) => {
		const departments = departmentIds ? Set(departmentIds).map((departmentId) => this.getDepartmentCollection().doc(departmentId)) : Set();
		const reference = await this.getEmployeeCollection().add({
			employeeReference: employeeReference ? employeeReference : null,
			user: this.getUserCollection().doc(userId),
			departments: departments.toJS(),
		});

		return reference.id;
	};

	read = async (id) => {
		const employee = (await this.getEmployeeCollection().doc(id).get()).data();

		if (!employee) {
			return null;
		}

		return Immutable.fromJS(employee)
			.set('id', id)
			.remove('user')
			.set('userId', employee.user.id)
			.remove('departments')
			.set('departmentIds', List(employee.departments.map((department) => department.id)));
	};

	update = async ({ id, employeeReference, userId, departmentIds }) => {
		const departments = departmentIds ? Set(departmentIds).map((departmentId) => this.getDepartmentCollection().doc(departmentId)) : Set();

		await this.getEmployeeCollection()
			.doc(id)
			.update({
				employeeReference: employeeReference ? employeeReference : null,
				user: this.getUserCollection().doc(userId),
				departments: departments.toJS(),
			});

		return id;
	};

	delete = async (id) => {
		await this.getEmployeeCollection().doc(id).delete();

		return id;
	};

	search = async ({ employeeIds }) => {
		let employees = List();

		if (!employeeIds || employeeIds.length === 0) {
			const snapshot = await this.getEmployeeCollection().get();

			if (!snapshot.empty) {
				snapshot.forEach((employee) => {
					const employeeData = employee.data();
					const userId = employeeData.user.id;
					const departmentIds = List(employeeData.departments.map((department) => department.id));

					employees = employees.push(
						Immutable.fromJS(employeeData)
							.set('id', employee.id)
							.remove('user')
							.set('userId', userId)
							.remove('departments')
							.set('departmentIds', departmentIds)
					);
				});
			}

			return employees;
		}

		return Immutable.fromJS(await Promise.all(employeeIds.map((id) => this.read(id)))).filter((employee) => employee !== null);
	};
}
