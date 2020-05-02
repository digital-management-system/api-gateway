import Immutable, { List, Set } from 'immutable';

import BaseRepositoryService from './BaseRepositoryService';

export default class EmployeeRepositoryService extends BaseRepositoryService {
	constructor() {
		const toDocument = ({ employeeReference, position, mobile, userId, departmentIds, reportingToEmployeeId, manufacturerId }) => {
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

		const toObject = (document, id) =>
			Immutable.fromJS(document)
				.set('id', id)
				.remove('manufacturer')
				.set('manufacturerId', document.manufacturer.id)
				.remove('user')
				.set('userId', document.user.id)
				.remove('departments')
				.set('departmentIds', List(document.departments.map((department) => department.id)))
				.remove('reportingToEmployee')
				.set('reportingToEmployeeId', document.reportingToEmployee ? document.reportingToEmployee.id : null);

		const buildWhereClause = (
			collection,
			{ manufacturerId, employeeReference, position, mobile, departmentId, userId, reportingToEmployeeId }
		) => {
			let collectionWithWhereClause = collection;

			if (manufacturerId) {
				collectionWithWhereClause = collectionWithWhereClause.where(
					'manufacturer',
					'==',
					this.getManufacturerCollection().doc(manufacturerId)
				);
			}

			if (employeeReference) {
				collectionWithWhereClause = collectionWithWhereClause.where('employeeReference', '==', employeeReference);
			}

			if (position) {
				collectionWithWhereClause = collectionWithWhereClause.where('position', '==', position);
			}

			if (mobile) {
				collectionWithWhereClause = collectionWithWhereClause.where('mobile', '==', mobile);
			}

			if (departmentId) {
				collectionWithWhereClause = collectionWithWhereClause.where(
					'departments',
					'array-contains',
					this.getDepartmentCollection().doc(departmentId)
				);
			}

			if (userId) {
				collectionWithWhereClause = collectionWithWhereClause.where('user', '==', this.getUserCollection().doc(userId));
			}

			if (reportingToEmployeeId) {
				collectionWithWhereClause = collectionWithWhereClause.where(
					'reportingToEmployee',
					'==',
					this.getEmployeeCollection().doc(reportingToEmployeeId)
				);
			}

			return collectionWithWhereClause;
		};

		super(BaseRepositoryService.collectioNames.employee, toDocument, toObject, buildWhereClause);
	}
}
