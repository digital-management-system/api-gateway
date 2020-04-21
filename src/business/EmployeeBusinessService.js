export default class EmployeeBusinessService {
	constructor({ employeeRepositoryService }) {
		this.employeeRepositoryService = employeeRepositoryService;
	}

	create = async (info) => this.employeeRepositoryService.create(info);
	read = async (id) => this.employeeRepositoryService.read(id);
	update = async (info) => this.employeeRepositoryService.update(info);
	delete = async (id) => this.employeeRepositoryService.delete(id);
	search = async (searchCriteria) => this.employeeRepositoryService.search(searchCriteria);
}
