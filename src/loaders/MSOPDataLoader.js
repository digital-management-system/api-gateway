import Dataloader from 'dataloader';

export default class MSOPDataLoader {
	constructor({ msopBusinessService }) {
		this.msopLoaderById = new Dataloader(async (ids) => {
			return Promise.all(ids.map(async (id) => msopBusinessService.read(id)));
		});
	}

	getMSOPLoaderById = () => this.msopLoaderById;
}
