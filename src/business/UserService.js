export default class UserService {
	constructor({ logger }) {
		this.logger = logger;
	}

	get = async () => ({ id: 'User Id' });
}
