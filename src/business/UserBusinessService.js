export default class UserBusinessService {
	constructor({ logger }) {
		this.logger = logger;
	}

	get = async () => ({ id: 'User Id' });

	read = async (email) => ({ id: 'User Id', email, name: { firstName: 'F1', lastName: 'L1', middleName: 'M1', preferredName: 'P1' } });

	search = async ({ emails }) => Promise.all(emails.map((email) => this.read(email)));
}
