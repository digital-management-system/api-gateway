import Dataloader from 'dataloader';

export default class UserDataLoader {
	constructor({ userBusinessService }) {
		this.employeeUserTypeLoaderByEmail = new Dataloader(async (emails) => {
			return Promise.all(emails.map(async (email) => userBusinessService.readEmployee(email)));
		});

		this.manufacturerUserTypeLoaderByEmail = new Dataloader(async (emails) => {
			return Promise.all(emails.map(async (email) => userBusinessService.readManufacturer(email)));
		});

		this.userLoaderById = new Dataloader(async (ids) => {
			return Promise.all(ids.map(async (id) => userBusinessService.read(id)));
		});
	}

	getEmployeeUserTypeLoaderByEmail = () => this.employeeUserTypeLoaderByEmail;

	getManufacturerUserTypeLoaderByEmail = () => this.manufacturerUserTypeLoaderByEmail;

	getUserLoaderById = () => this.userLoaderById;
}
