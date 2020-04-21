import Dataloader from 'dataloader';

export const createEmployeeUserTypeLoaderByEmail = ({ userBusinessService }) => {
	return new Dataloader(async (emails) => {
		return Promise.all(emails.map(async (email) => userBusinessService.readEmployee(email)));
	});
};

export const createManufacturerUserTypeLoaderByEmail = ({ userBusinessService }) => {
	return new Dataloader(async (emails) => {
		return Promise.all(emails.map(async (email) => userBusinessService.readManufacturer(email)));
	});
};
