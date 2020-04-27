export default class MSOPBusinessService {
	constructor({ msopRepositoryService }) {
		this.msopRepositoryService = msopRepositoryService;
	}

	create = async (info) => this.msopRepositoryService.create(info);
	read = async (id) => this.msopRepositoryService.read(id);
	update = async (info) => this.msopRepositoryService.update(info);
	delete = async (id) => this.msopRepositoryService.delete(id);
	search = async (searchCriteria) => this.msopRepositoryService.search(searchCriteria);
}
