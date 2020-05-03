import Dataloader from 'dataloader';

export default class MeetingDayDataLoader {
	constructor({ meetingDayBusinessService }) {
		this.meetingDayLoaderById = new Dataloader(async (ids) => Promise.all(ids.map(async (id) => meetingDayBusinessService.read(id))));
	}

	getMeetingDayLoaderById = () => this.meetingDayLoaderById;
}
