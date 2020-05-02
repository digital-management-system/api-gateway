export default class MeetingDayBusinessService {
	constructor({ meetingDayRepositoryService }) {
		this.meetingDayRepositoryService = meetingDayRepositoryService;
	}

	create = async (info) => this.meetingDayRepositoryService.create(info);
	read = async (id) => this.meetingDayRepositoryService.read(id);
	update = async (info) => this.meetingDayRepositoryService.update(info);
	delete = async (id) => this.meetingDayRepositoryService.delete(id);
	search = async (searchCriteria) => this.meetingDayRepositoryService.search(searchCriteria);
}
