import Immutable, { List, Set } from 'immutable';

import BaseRepositoryService from './BaseRepositoryService';

export default class MSOPRepositoryService extends BaseRepositoryService {
	create = async (info) => (await this.getMSOPCollection().add(this.getMSOPDocument(info))).id;

	read = async (id) => {
		const msop = (await this.getMSOPCollection().doc(id).get()).data();

		return msop ? this.createReturnObject(msop, id) : null;
	};

	update = async ({ id, ...info }) => {
		await this.getMSOPCollection().doc(id).update(this.getMSOPDocument(info));

		return id;
	};

	delete = async (id) => {
		await this.getMSOPCollection().doc(id).delete();

		return id;
	};

	search = async ({ msopIds }) => {
		let msops = List();

		if (!msopIds || msopIds.length === 0) {
			const snapshot = await this.getMSOPCollection().get();

			if (!snapshot.empty) {
				snapshot.forEach((msop) => {
					msops = msops.push(this.createReturnObject(msop.data(), msop.id));
				});
			}

			return msops;
		}

		return Immutable.fromJS(await Promise.all(msopIds.map((id) => this.read(id)))).filter((msop) => msop !== null);
	};

	getMSOPDocument = ({
		manufacturerId,
		meetingName,
		meetingDuration,
		frequency,
		meetingDays,
		agendas,
		departmentId,
		chairPersonEmployeeId,
		actionLogSecretaryEmployeeId,
		attendeeIds,
	}) => {
		const attendees = attendeeIds ? Set(attendeeIds).map((attendeeId) => this.getEmployeeCollection().doc(attendeeId)) : Set();

		return {
			manufacturer: this.getManufacturerCollection().doc(manufacturerId),
			meetingName,
			meetingDuration,
			frequency,
			meetingDays,
			agendas: agendas ? agendas : null,
			department: this.getDepartmentCollection().doc(departmentId),
			chairPersonEmployee: this.getEmployeeCollection().doc(chairPersonEmployeeId),
			actionLogSecretaryEmployee: this.getEmployeeCollection().doc(actionLogSecretaryEmployeeId),
			attendees: attendees.toJS(),
		};
	};

	createReturnObject = (msop, id) =>
		Immutable.fromJS(msop)
			.set('id', id)
			.remove('manufacturer')
			.set('manufacturerId', msop.manufacturer.id)
			.remove('department')
			.set('departmentId', msop.department.id)
			.remove('chairPersonEmployee')
			.set('chairPersonEmployeeId', msop.chairPersonEmployee.id)
			.remove('actionLogSecretaryEmployee')
			.set('actionLogSecretaryEmployeeId', msop.actionLogSecretaryEmployee.id)
			.remove('attendees')
			.set('attendeeIds', List(msop.attendees.map((attendee) => attendee.id)));
}
