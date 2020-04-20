import Dataloader from 'dataloader';

export const createEmployeeLoaderById = ({ employeeBusinessService }) => {
	return new Dataloader(async (ids) => {
		return Promise.all(ids.map(async (id) => employeeBusinessService.read(id)));
	});
};
