import Dataloader from 'dataloader';

export const createDepartmentLoaderById = ({ departmentRepositoryService }) => {
	return new Dataloader(async (ids) => {
		return Promise.all(ids.map(async (id) => departmentRepositoryService.read(id)));
	});
};
