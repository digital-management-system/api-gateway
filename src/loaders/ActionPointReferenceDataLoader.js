import Dataloader from 'dataloader';

export default class ActionPointReferenceDataLoader {
	constructor({ actionPointReferenceBusinessService }) {
		this.actionPointReferenceLoaderById = new Dataloader(async (ids) =>
			Promise.all(ids.map(async (id) => actionPointReferenceBusinessService.read(id)))
		);
	}

	getActionPointReferenceLoaderById = () => this.actionPointReferenceLoaderById;
}
