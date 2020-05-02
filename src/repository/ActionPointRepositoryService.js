import Immutable, { List } from 'immutable';
import dayjs from 'dayjs';

import BaseRepositoryService from './BaseRepositoryService';

export default class ActionPointRepositoryService extends BaseRepositoryService {
	constructor() {
		const toDocument = ({
			manufacturerId,
			msopId,
			assigneeId,
			departmentId,
			assignedDate,
			dueDate,
			priorityId,
			statusId,
			referenceIds,
			comments,
		}) => {
			const references = referenceIds
				? Set(referenceIds).map((referenceId) => this.getActionPointReferenceCollection().doc(referenceId))
				: Set();

			return {
				manufacturer: this.getManufacturerCollection().doc(manufacturerId),
				msop: this.getMSOPCollection().doc(msopId),
				assignee: this.getEmployeeCollection().doc(assigneeId),
				department: this.getDepartmentCollection().doc(departmentId),
				assignedDate: dayjs(assignedDate).toDate(),
				dueDate: dueDate ? dayjs(dueDate).toDate() : null,
				priority: this.getActionPointPriorityCollection().doc(priorityId),
				status: this.getActionPointStatusCollection().doc(statusId),
				references: references.toJS(),
				comments: comments ? comments : null,
			};
		};

		const toObject = (document, id) => {
			let returnObject = Immutable.fromJS(document)
				.set('id', id)
				.remove('manufacturer')
				.set('manufacturerId', document.manufacturer.id)
				.remove('msop')
				.set('msopId', document.msop.id)
				.remove('assignee')
				.set('assigneeId', document.assignee.id)
				.remove('department')
				.set('departmentId', document.department.id)
				.remove('assignedDate')
				.set('assignedDate', dayjs(document.assignedDate).toISOString())
				.remove('priority')
				.set('priorityId', document.priority.id)
				.remove('status')
				.set('statusId', document.status.id)
				.remove('references')
				.set('referenceIds', List(document.references.map((reference) => reference.id)));

			if (document.dueDate) {
				returnObject = returnObject.remove('dueDate').set('dueDate', dayjs(document.dueDate).toISOString());
			}

			return returnObject;
		};

		const buildWhereClause = (
			collection,
			{ manufacturerId, msopId, assigneeId, departmentId, assignedDate, dueDate, priorityId, statusId, referenceId }
		) => {
			let collectionWithWhereClause = collection;

			if (manufacturerId) {
				collectionWithWhereClause = collectionWithWhereClause.where(
					'manufacturer',
					'==',
					this.getManufacturerCollection().doc(manufacturerId)
				);
			}

			if (msopId) {
				collectionWithWhereClause = collectionWithWhereClause.where('msop', '==', this.getMSOPCollection().doc(msopId));
			}

			if (assigneeId) {
				collectionWithWhereClause = collectionWithWhereClause.where('assignee', '==', this.getEmployeeCollection().doc(assigneeId));
			}

			if (departmentId) {
				collectionWithWhereClause = collectionWithWhereClause.where('department', '==', this.getDepartmentCollection().doc(departmentId));
			}

			if (assignedDate) {
				collectionWithWhereClause = collectionWithWhereClause.where('assignedDate', '==', dayjs(assignedDate).toDate());
			}

			if (dueDate) {
				collectionWithWhereClause = collectionWithWhereClause.where('dueDate', '==', dayjs(dueDate).toDate());
			}

			if (priorityId) {
				collectionWithWhereClause = collectionWithWhereClause.where(
					'priority',
					'==',
					this.getActionPointPriorityCollection().doc(priorityId)
				);
			}

			if (statusId) {
				collectionWithWhereClause = collectionWithWhereClause.where('status', '==', this.getActionPointStatusCollection().doc(statusId));
			}

			if (referenceId) {
				collectionWithWhereClause = collectionWithWhereClause.where(
					'references',
					'array-contains',
					this.getActionPointReferenceCollection().doc(referenceId)
				);
			}

			return collectionWithWhereClause;
		};

		super(BaseRepositoryService.collectioNames.actionPoint, toDocument, toObject, buildWhereClause);
	}
}
