import Immutable, { List, Set } from 'immutable';

import BaseRepositoryService from './BaseRepositoryService';

export default class EmployeeRepositoryService extends BaseRepositoryService {
	create = async (info) => (await this.getEmployeeCollection().add(this.getEmployeeDocument(info))).id;

	read = async (id) => {
		const employee = (await this.getEmployeeCollection().doc(id).get()).data();

		return employee ? this.createReturnObject(employee, id) : null;
	};

	update = async ({ id, ...info }) => {
		await this.getEmployeeCollection().doc(id).update(this.getEmployeeDocument(info));

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
					employees = employees.push(this.createReturnObject(employee.data(), employee.id));
				});
			}

			return employees;
		}

		return Immutable.fromJS(await Promise.all(employeeIds.map((id) => this.read(id)))).filter((employee) => employee !== null);
	};

	getEmployeeDocument = ({ employeeReference, position, mobile, userId, departmentIds, reportingToEmployeeId, manufacturerId }) => {
		const departments = departmentIds ? Set(departmentIds).map((departmentId) => this.getDepartmentCollection().doc(departmentId)) : Set();

		return {
			manufacturer: this.getManufacturerCollection().doc(manufacturerId),
			employeeReference: employeeReference ? employeeReference : null,
			position: position ? position : null,
			mobile: mobile ? mobile : null,
			user: this.getUserCollection().doc(userId),
			departments: departments.toJS(),
			reportingToEmployee: reportingToEmployeeId ? this.getEmployeeCollection().doc(reportingToEmployeeId) : null,
		};
	};

	createReturnObject = (employee, id) =>
		Immutable.fromJS(employee)
			.set('id', id)
			.remove('manufacturer')
			.set('manufacturerId', employee.manufacturer.id)
			.remove('user')
			.set('userId', employee.user.id)
			.remove('departments')
			.set('departmentIds', List(employee.departments.map((department) => department.id)))
			.remove('reportingToEmployee')
			.set('reportingToEmployeeId', employee.reportingToEmployee ? employee.reportingToEmployee.id : null);
}
