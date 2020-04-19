export default class UserBusinessService {
	constructor({ logger }) {
		this.logger = logger;
	}

	get = async () => ({ id: 'User Id' });
}
