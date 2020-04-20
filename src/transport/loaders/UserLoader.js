import Dataloader from 'dataloader';

export const createUserLoaderByEmail = ({ userBusinessService }) => {
	return new Dataloader(async (emails) => {
		return Promise.all(emails.map(async (email) => userBusinessService.read(email)));
	});
};
