import Immutable, { List, Set } from 'immutable';

import BaseRepositoryService from './BaseRepositoryService';

export default class MSOPRepositoryService extends BaseRepositoryService {
	getMSOPDocument = ({
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

	create = async (info) => (await this.getMSOPCollection().add(this.getMSOPDocument(info))).id;

	read = async (id) => {
		const msop = (await this.getMSOPCollection().doc(id).get()).data();

		if (!msop) {
			return null;
		}

		return Immutable.fromJS(msop)
			.set('id', id)
			.remove('department')
			.set('departmentId', msop.department.id)
			.remove('chairPersonEmployee')
			.set('chairPersonEmployeeId', msop.chairPersonEmployee.id)
			.remove('actionLogSecretaryEmployee')
			.set('actionLogSecretaryEmployeeId', msop.actionLogSecretaryEmployee.id)
			.remove('attendees')
			.set('attendeeIds', List(msop.attendees.map((attendee) => attendee.id)));
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
					const msopData = msop.data();

					msops = msops.push(
						Immutable.fromJS(msopData)
							.set('id', msop.id)
							.remove('department')
							.set('departmentId', msopData.department.id)
							.remove('chairPersonEmployee')
							.set('chairPersonEmployeeId', msopData.chairPersonEmployee.id)
							.remove('actionLogSecretaryEmployee')
							.set('actionLogSecretaryEmployeeId', msopData.actionLogSecretaryEmployee.id)
							.remove('attendees')
							.set('attendeeIds', List(msopData.attendees.map((attendee) => attendee.id)))
					);
				});
			}

			return msops;
		}

		return Immutable.fromJS(await Promise.all(msopIds.map((id) => this.read(id)))).filter((msop) => msop !== null);
	};
}
