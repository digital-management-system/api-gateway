export default class ActionReferenceBusinessService {
	constructor({ actionReferenceRepositoryService }) {
		this.actionReferenceRepositoryService = actionReferenceRepositoryService;
	}

	create = async (info) => this.actionReferenceRepositoryService.create(info);
	read = async (id) => this.actionReferenceRepositoryService.read(id);
	update = async (info) => this.actionReferenceRepositoryService.update(info);
	delete = async (id) => this.actionReferenceRepositoryService.delete(id);
	search = async (searchCriteria) => this.actionReferenceRepositoryService.search(searchCriteria);
}
