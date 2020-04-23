export default class ManufacturerBusinessService {
	constructor({ manufacturerRepositoryService }) {
		this.manufacturerRepositoryService = manufacturerRepositoryService;
	}

	create = async (info) => this.manufacturerRepositoryService.create(info);
	read = async (id) => this.manufacturerRepositoryService.read(id);
	update = async (info) => this.manufacturerRepositoryService.update(info);
	delete = async (id) => this.manufacturerRepositoryService.delete(id);
	search = async (searchCriteria) => this.manufacturerRepositoryService.search(searchCriteria);
}
