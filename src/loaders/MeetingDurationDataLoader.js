import Dataloader from 'dataloader';

export default class MeetingDurationDataLoader {
	constructor({ meetingDurationBusinessService }) {
		this.meetingDurationLoaderById = new Dataloader(async (ids) => {
			return Promise.all(ids.map(async (id) => meetingDurationBusinessService.read(id)));
		});
	}

	getMeetingDurationLoaderById = () => this.meetingDurationLoaderById;
}
