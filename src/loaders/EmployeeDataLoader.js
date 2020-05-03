import Dataloader from 'dataloader';

export default class EmployeeDataLoader {
	constructor({ employeeBusinessService }) {
		this.employeeLoaderById = new Dataloader(async (ids) => Promise.all(ids.map(async (id) => employeeBusinessService.read(id))));
	}

	getEmployeeLoaderById = () => this.employeeLoaderById;
}
