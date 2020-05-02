import Dataloader from 'dataloader';

export default class DepartmentDataLoader {
	constructor({ departmentBusinessService }) {
		this.departmentLoaderById = new Dataloader(async (ids) => {
			return Promise.all(ids.map(async (id) => departmentBusinessService.read(id)));
		});
	}

	getDepartmentLoaderById = () => this.departmentLoaderById;
}
