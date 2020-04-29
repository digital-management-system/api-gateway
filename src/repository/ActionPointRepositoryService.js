import Immutable, { List } from 'immutable';
import dayjs from 'dayjs';

import BaseRepositoryService from './BaseRepositoryService';

export default class ActionPointRepositoryService extends BaseRepositoryService {
	create = async (info) => (await this.getActionPointCollection().add(this.getActionPointDocument(info))).id;

	read = async (id) => {
		const actionPoint = (await this.getActionPointCollection().doc(id).get()).data();

		return actionPoint ? this.createReturnObject(actionPoint, id) : null;
	};

	update = async ({ id, ...info }) => {
		await this.getActionPointCollection().doc(id).update(this.getActionPointDocument(info));

		return id;
	};

	delete = async (id) => {
		await this.getActionPointCollection().doc(id).delete();

		return id;
	};

	search = async ({ actionPointIds }) => {
		let actionPoints = List();

		if (!actionPointIds || actionPointIds.length === 0) {
			const snapshot = await this.getActionPointCollection().get();

			if (!snapshot.empty) {
				snapshot.forEach((actionPoint) => {
					actionPoints = actionPoints.push(this.createReturnObject(actionPoint.data(), actionPoint.id));
				});
			}

			return actionPoints;
		}

		return Immutable.fromJS(await Promise.all(actionPointIds.map((id) => this.read(id)))).filter((actionPoint) => actionPoint !== null);
	};

	getActionPointDocument = ({
		manufacturerId,
		msopId,
		assigneeId,
		departmentId,
		assignedDate,
		dueDate,
		priority,
		status,
		actionReferenceIds,
		comments,
	}) => {
		const actionReferences = actionReferenceIds
			? Set(actionReferenceIds).map((actionReferenceId) => this.getActionReferenceCollection().doc(actionReferenceId))
			: Set();

		return {
			manufacturer: this.getManufacturerCollection().doc(manufacturerId),
			msop: this.getMSOPCollection().doc(msopId),
			assignee: this.getEmployeeCollection().doc(assigneeId),
			department: this.getDepartmentCollection().doc(departmentId),
			assignedDate: dayjs(assignedDate).toDate(),
			dueDate: dueDate ? dayjs(dueDate).toDate() : null,
			staprioritytus: priority ? priority : null,
			status: status ? status : null,
			actionReferences: actionReferences.toJS(),
			comments: comments ? comments : null,
		};
	};

	createReturnObject = (actionPoint, id) => {
		let returnObject = Immutable.fromJS(actionPoint)
			.set('id', id)
			.remove('manufacturer')
			.set('manufacturerId', actionPoint.manufacturer.id)
			.remove('msop')
			.set('msopId', actionPoint.msop.id)
			.remove('assignee')
			.set('assigneeId', actionPoint.assignee.id)
			.remove('department')
			.set('departmentId', actionPoint.department.id)
			.remove('actionReferences')
			.set('actionReferenceIds', List(actionPoint.actionReferences.map((actionReference) => actionReference.id)))
			.remove('assignedDate')
			.set('assignedDate', dayjs(actionPoint.assignedDate).toISOString());

		if (actionPoint.dueDate) {
			returnObject = returnObject.remove('dueDate').set('dueDate', dayjs(actionPoint.dueDate).toISOString());
		}

		return returnObject;
	};
}
