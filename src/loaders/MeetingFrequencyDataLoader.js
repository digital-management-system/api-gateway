import Dataloader from 'dataloader';

export default class MeetingFrequencyDataLoader {
	constructor({ meetingFrequencyBusinessService }) {
		this.meetingFrequencyLoaderById = new Dataloader(async (ids) => Promise.all(ids.map(async (id) => meetingFrequencyBusinessService.read(id))));
	}

	getMeetingFrequencyLoaderById = () => this.meetingFrequencyLoaderById;
}
