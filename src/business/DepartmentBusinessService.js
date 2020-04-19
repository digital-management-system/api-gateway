export default class DepartmentBusinessService {
	constructor({ departmentRepositoryService }) {
		this.departmentRepositoryService = departmentRepositoryService;
	}

	create = async (info) => this.departmentRepositoryService.create(info);

	read = async (id) => this.departmentRepositoryService.read(id);

	update = async (info) => this.departmentRepositoryService.update(info);

	delete = async (id) => this.departmentRepositoryService.delete(id);

	search = async (searchCriteria) => this.departmentRepositoryService.search(searchCriteria);
}
