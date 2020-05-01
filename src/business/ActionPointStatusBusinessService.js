export default class ActionPointStatusBusinessService {
	constructor({ actionPointStatusRepositoryService }) {
		this.actionPointStatusRepositoryService = actionPointStatusRepositoryService;
	}

	create = async (info) => this.actionPointStatusRepositoryService.create(info);
	read = async (id) => this.actionPointStatusRepositoryService.read(id);
	update = async (info) => this.actionPointStatusRepositoryService.update(info);
	delete = async (id) => this.actionPointStatusRepositoryService.delete(id);
	search = async (searchCriteria) => this.actionPointStatusRepositoryService.search(searchCriteria);
}
