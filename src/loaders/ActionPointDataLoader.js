import Dataloader from 'dataloader';

export default class ActionPointDataLoader {
	constructor({ actionPointBusinessService }) {
		this.actionPointLoaderById = new Dataloader(async (ids) => {
			return Promise.all(ids.map(async (id) => actionPointBusinessService.read(id)));
		});
	}

	getActionPointLoaderById = () => this.actionPointLoaderById;
}
