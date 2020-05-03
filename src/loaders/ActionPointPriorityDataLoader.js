import Dataloader from 'dataloader';

export default class ActionPointPriorityDataLoader {
	constructor({ actionPointPriorityBusinessService }) {
		this.actionPointPriorityLoaderById = new Dataloader(async (ids) =>
			Promise.all(ids.map(async (id) => actionPointPriorityBusinessService.read(id)))
		);
	}

	getActionPointPriorityLoaderById = () => this.actionPointPriorityLoaderById;
}
