import Dataloader from 'dataloader';

export const createEmployeeLoaderById = ({ employeeRepositoryService }) => {
	return new Dataloader(async (ids) => {
		return Promise.all(ids.map(async (id) => employeeRepositoryService.read(id)));
	});
};
