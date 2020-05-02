export default class ActionPointPriorityBusinessService {
	constructor({ actionPointPriorityRepositoryService }) {
		this.actionPointPriorityRepositoryService = actionPointPriorityRepositoryService;
	}

	create = async (info) => this.actionPointPriorityRepositoryService.create(info);
	read = async (id) => this.actionPointPriorityRepositoryService.read(id);
	update = async (info) => this.actionPointPriorityRepositoryService.update(info);
	delete = async (id) => this.actionPointPriorityRepositoryService.delete(id);
	search = async (searchCriteria) => this.actionPointPriorityRepositoryService.search(searchCriteria);
}
