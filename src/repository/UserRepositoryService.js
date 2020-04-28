import Immutable, { List } from 'immutable';

import BaseRepositoryService from './BaseRepositoryService';

export default class UserRepositoryService extends BaseRepositoryService {
	readEmployee = async (email) => this.readByEmail(email, 'employee');
	readManufacturer = async (email) => this.readByEmail(email, 'manufacturer');
	searchEmployee = async (searchArgs) => this.search(searchArgs, 'employee');
	searchManufacturer = async (searchArgs) => this.search(searchArgs, 'manufacturer');

	readById = async (id) => {
		const user = (await this.getUserCollection().doc(id).get()).data();

		return user ? this.createReturnObject(user, id) : null;
	};

	readByEmail = async (email, userType) => {
		let usersReference = this.getUserCollection().where('email', '==', email);

		if (userType) {
			usersReference = usersReference.where('userType', '==', userType);
		}

		const snapshot = await usersReference.get();
		let users = List();

		if (snapshot.empty) {
			return null;
		}

		snapshot.forEach((user) => {
			users = users.push(Immutable.fromJS(user.data()).set('id', user.id));
		});

		if (users.count() > 1) {
			throw new Error(`Multiple email address ${email} exists in the database!`);
		}

		return users.get(0);
	};

	search = async ({ emails }, userType) => {
		let users = List();

		if (!emails || emails.length === 0) {
			let usersReference = this.getUserCollection();

			if (userType) {
				usersReference = usersReference.where('userType', '==', userType);
			}

			const snapshot = await usersReference.get();

			if (!snapshot.empty) {
				snapshot.forEach((user) => {
					users = users.push(this.createReturnObject(user.data(), user.id));
				});
			}

			return users;
		}

		return Immutable.fromJS(await Promise.all(emails.map((email) => this.readByEmail(email, userType)))).filter((user) => user !== null);
	};

	createReturnObject = (user, id) => Immutable.fromJS(user).set('id', id);
}
