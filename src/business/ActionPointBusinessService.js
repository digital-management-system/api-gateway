export default class ActionPointBusinessService {
	constructor({ actionPointRepositoryService }) {
		this.actionPointRepositoryService = actionPointRepositoryService;
	}

	create = async (info) => this.actionPointRepositoryService.create(info);
	read = async (id) => this.actionPointRepositoryService.read(id);
	update = async (info) => this.actionPointRepositoryService.update(info);
	delete = async (id) => this.actionPointRepositoryService.delete(id);
	search = async (searchCriteria) => this.actionPointRepositoryService.search(searchCriteria);
}
