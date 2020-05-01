export default class MeetingFrequencyBusinessService {
	constructor({ meetingFrequencyRepositoryService }) {
		this.meetingFrequencyRepositoryService = meetingFrequencyRepositoryService;
	}

	create = async (info) => this.meetingFrequencyRepositoryService.create(info);
	read = async (id) => this.meetingFrequencyRepositoryService.read(id);
	update = async (info) => this.meetingFrequencyRepositoryService.update(info);
	delete = async (id) => this.meetingFrequencyRepositoryService.delete(id);
	search = async (searchCriteria) => this.meetingFrequencyRepositoryService.search(searchCriteria);
}
