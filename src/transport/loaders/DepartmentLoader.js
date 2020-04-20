import Dataloader from 'dataloader';

export const createDepartmentLoaderById = ({ departmentBusinessService }) => {
	return new Dataloader(async (ids) => {
		return Promise.all(ids.map(async (id) => departmentBusinessService.read(id)));
	});
};
