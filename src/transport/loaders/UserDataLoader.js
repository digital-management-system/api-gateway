import Dataloader from 'dataloader';

export default class UserDataLoader {
	constructor({ userBusinessService }) {
		this.employeeUserTypeLoaderByEmail = new Dataloader(async (emails) => {
			return Promise.all(emails.map(async (email) => userBusinessService.readEmployee(email)));
		});
		this.manufacturerUserTypeLoaderByEmail = new Dataloader(async (emails) => {
			return Promise.all(emails.map(async (email) => userBusinessService.readManufacturer(email)));
		});
	}

	getEmployeeUserTypeLoaderByEmail = () => this.employeeUserTypeLoaderByEmail;

	getManufacturerUserTypeLoaderByEmail = () => this.manufacturerUserTypeLoaderByEmail;
}
