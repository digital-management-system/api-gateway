import admin from 'firebase-admin';
import Immutable, { List, Set } from 'immutable';

export default class EmployeeRepositoryService {
	getCollection = () => admin.firestore().collection('employee');
	getDepartmentCollection = () => admin.firestore().collection('department');
	getUserCollection = () => admin.firestore().collection('user');

	create = async ({ employeeReference, departmentIds, userId }) => {
		const departments = departmentIds ? Set(departmentIds).map((departmentId) => this.getDepartmentCollection().doc(departmentId)) : Set();
		const reference = await this.getCollection().add({
			employeeReference: employeeReference ? employeeReference : null,
			departments: departments.toJS(),
			user: this.getUserCollection().doc(userId),
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
			.set('departments', await this.readDepartments(employee.departments))
			.set('user', await this.readUser(employee.user));
	};

	update = async ({ id, employeeReference, departmentIds, userId }) => {
		const departments = departmentIds ? Set(departmentIds).map((departmentId) => this.getDepartmentCollection().doc(departmentId)) : Set();

		await this.getCollection()
			.doc(id)
			.update({
				employeeReference: employeeReference ? employeeReference : null,
				departments: departments.toJS(),
				user: this.getUserCollection().doc(userId),
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

			employees = List(
				await Promise.all(
					employees
						.map(async (employee) => {
							const departments = await this.readDepartments(employee.get('departments'));

							return employee.set('departments', departments);
						})
						.toArray()
				)
			);

			return List(
				await Promise.all(
					employees
						.map(async (employee) => {
							const user = await this.readUser(employee.get('user'));

							return employee.set('user', user);
						})
						.toArray()
				)
			);
		}

		return Immutable.fromJS(await Promise.all(employeeIds.map((id) => this.read(id)))).filter((employee) => employee !== null);
	};

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

	readUser = async (userRef) => {
		const userDocumentRef = await userRef.get();
		const userData = userDocumentRef.data();

		if (!userData) {
			return null;
		}

		return Immutable.fromJS(userData).set('id', userDocumentRef.id);
	};
}
