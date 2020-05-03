import Dataloader from 'dataloader';

export default class ManufacturerDataLoader {
	constructor({ manufacturerBusinessService }) {
		this.manufacturerLoaderById = new Dataloader(async (ids) => Promise.all(ids.map(async (id) => manufacturerBusinessService.read(id))));
	}

	getManufacturerLoaderById = () => this.manufacturerLoaderById;
}
