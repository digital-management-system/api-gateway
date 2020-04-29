import Dataloader from 'dataloader';

export default class ActionReferenceDataLoader {
	constructor({ actionReferenceBusinessService }) {
		this.actionReferenceLoaderById = new Dataloader(async (ids) => {
			return Promise.all(ids.map(async (id) => actionReferenceBusinessService.read(id)));
		});
	}

	getActionReferenceLoaderById = () => this.actionReferenceLoaderById;
}
