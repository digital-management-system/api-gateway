import Dataloader from 'dataloader';

export const createDepartmentLoaderById = () => {
	return new Dataloader(async (ids) => {
		return ids.map((id) => ({
			id,
			name: 'name: ' + id,
			description: 'description: ' + id,
		}));
	});
};
