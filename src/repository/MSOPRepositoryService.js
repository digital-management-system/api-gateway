import Immutable, { List, Set } from 'immutable';

import BaseRepositoryService from './BaseRepositoryService';

export default class MSOPRepositoryService extends BaseRepositoryService {
	constructor() {
		const toDocument = ({
			manufacturerId,
			meetingName,
			durationId,
			frequencyId,
			meetingDayIds,
			agendas,
			departmentId,
			chairPersonEmployeeId,
			actionLogSecretaryEmployeeId,
			attendeeIds,
		}) => {
			const meetingDays = meetingDayIds ? Set(meetingDayIds).map((meetingDayId) => this.getMeetingDayCollection().doc(meetingDayId)) : Set();
			const attendees = attendeeIds ? Set(attendeeIds).map((attendeeId) => this.getEmployeeCollection().doc(attendeeId)) : Set();

			return {
				manufacturer: this.getManufacturerCollection().doc(manufacturerId),
				meetingName,
				duration: this.getMeetingDurationCollection().doc(durationId),
				frequency: this.getMeetingFrequencyCollection().doc(frequencyId),
				meetingDays: meetingDays.toJS(),
				agendas: agendas ? agendas : null,
				department: this.getDepartmentCollection().doc(departmentId),
				chairPersonEmployee: this.getEmployeeCollection().doc(chairPersonEmployeeId),
				actionLogSecretaryEmployee: this.getEmployeeCollection().doc(actionLogSecretaryEmployeeId),
				attendees: attendees.toJS(),
			};
		};

		const toObject = (document, id) =>
			Immutable.fromJS(document)
				.set('id', id)
				.remove('manufacturer')
				.set('manufacturerId', document.manufacturer.id)
				.remove('duration')
				.set('durationId', document.duration.id)
				.remove('frequency')
				.set('frequencyId', document.frequency.id)
				.remove('meetingDays')
				.set('meetingDayIds', List(document.meetingDays.map((meetingDay) => meetingDay.id)))
				.remove('department')
				.set('departmentId', document.department.id)
				.remove('chairPersonEmployee')
				.set('chairPersonEmployeeId', document.chairPersonEmployee.id)
				.remove('actionLogSecretaryEmployee')
				.set('actionLogSecretaryEmployeeId', document.actionLogSecretaryEmployee.id)
				.remove('attendees')
				.set('attendeeIds', List(document.attendees.map((attendee) => attendee.id)));

		const buildWhereClause = (
			collection,
			{
				manufacturerId,
				meetingName,
				durationId,
				frequencyId,
				meetingDayId,
				departmentId,
				chairPersonEmployeeId,
				actionLogSecretaryEmployeeId,
				attendeeId,
			}
		) => {
			let collectionWithWhereClause = collection;

			if (manufacturerId) {
				collectionWithWhereClause = collectionWithWhereClause.where(
					'manufacturer',
					'==',
					this.getManufacturerCollection().doc(manufacturerId)
				);
			}

			if (meetingName) {
				collectionWithWhereClause = collectionWithWhereClause.where('meetingName', '==', meetingName);
			}

			if (durationId) {
				collectionWithWhereClause = collectionWithWhereClause.where('duration', '==', this.getMeetingDurationCollection().doc(durationId));
			}

			if (frequencyId) {
				collectionWithWhereClause = collectionWithWhereClause.where('frequency', '==', this.getMeetingFrequencyCollection().doc(frequencyId));
			}

			if (meetingDayId) {
				collectionWithWhereClause = collectionWithWhereClause.where(
					'meetingDays',
					'array-contains',
					this.getMeetingDayCollection().doc(meetingDayId)
				);
			}

			if (departmentId) {
				collectionWithWhereClause = collectionWithWhereClause.where('department', '==', this.getDepartmentCollection().doc(departmentId));
			}

			if (chairPersonEmployeeId) {
				collectionWithWhereClause = collectionWithWhereClause.where(
					'chairPersonEmployee',
					'==',
					this.getEmployeeCollection().doc(chairPersonEmployeeId)
				);
			}

			if (actionLogSecretaryEmployeeId) {
				collectionWithWhereClause = collectionWithWhereClause.where(
					'actionLogSecretaryEmployee',
					'==',
					this.getEmployeeCollection().doc(actionLogSecretaryEmployeeId)
				);
			}

			if (attendeeId) {
				collectionWithWhereClause = collectionWithWhereClause.where(
					'attendees',
					'array-contains',
					this.getEmployeeCollection().doc(attendeeId)
				);
			}

			return collectionWithWhereClause;
		};

		super(BaseRepositoryService.collectioNames.msop, toDocument, toObject, buildWhereClause);
	}
}
