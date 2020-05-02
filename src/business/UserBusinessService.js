export default class UserBusinessService {
	constructor({ userRepositoryService }) {
		this.userRepositoryService = userRepositoryService;
	}

	read = async (id) => this.userRepositoryService.readById(id);
	readEmployee = async (email) => this.userRepositoryService.readEmployee(email);
	readManufacturer = async (email) => this.userRepositoryService.readManufacturer(email);
	searchEmployee = async (searchCriteria) => this.userRepositoryService.searchEmployee(searchCriteria);
	searchManufacturer = async (searchCriteria) => this.userRepositoryService.searchManufacturer(searchCriteria);
}
