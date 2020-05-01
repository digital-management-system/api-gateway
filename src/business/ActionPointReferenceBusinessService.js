export default class ActionPointReferenceBusinessService {
	constructor({ actionPointReferenceRepositoryService }) {
		this.actionPointReferenceRepositoryService = actionPointReferenceRepositoryService;
	}

	create = async (info) => this.actionPointReferenceRepositoryService.create(info);
	read = async (id) => this.actionPointReferenceRepositoryService.read(id);
	update = async (info) => this.actionPointReferenceRepositoryService.update(info);
	delete = async (id) => this.actionPointReferenceRepositoryService.delete(id);
	search = async (searchCriteria) => this.actionPointReferenceRepositoryService.search(searchCriteria);
}
