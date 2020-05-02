export default class MeetingDurationBusinessService {
	constructor({ meetingDurationRepositoryService }) {
		this.meetingDurationRepositoryService = meetingDurationRepositoryService;
	}

	create = async (info) => this.meetingDurationRepositoryService.create(info);
	read = async (id) => this.meetingDurationRepositoryService.read(id);
	update = async (info) => this.meetingDurationRepositoryService.update(info);
	delete = async (id) => this.meetingDurationRepositoryService.delete(id);
	search = async (searchCriteria) => this.meetingDurationRepositoryService.search(searchCriteria);
}
