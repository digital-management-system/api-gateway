import Dataloader from 'dataloader';

export const createEmployeeLoaderById = () => {
	return new Dataloader(async (ids) => {
		return ids.map((id) => ({
			id,
			name: {
				firstName: 'firstName: ' + id,
				middleName: 'middleName: ' + id,
				lastName: 'lastName: ' + id,
				preferredName: 'preferredName: ' + id,
			},
		}));
	});
};
