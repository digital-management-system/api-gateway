import Dataloader from 'dataloader';

export default class ActionPointStatusDataLoader {
	constructor({ actionPointStatusBusinessService }) {
		this.actionPointStatusLoaderById = new Dataloader(async (ids) => {
			return Promise.all(ids.map(async (id) => actionPointStatusBusinessService.read(id)));
		});
	}

	getActionPointStatusLoaderById = () => this.actionPointStatusLoaderById;
}
