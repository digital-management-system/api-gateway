import admin from 'firebase-admin';
import Immutable, { Map, List } from 'immutable';

const dummyName = Map({
	firstName: 'No first name available',
	middleName: 'No middle name available',
	lastName: 'No last name available',
	preferredName: 'No preferred name available',
});

export default class UserRepositoryService {
	getCollection = () => admin.firestore().collection('user');

	readEmployee = async (email) => this.readByEmail(email, 'employee');
	readManufacturer = async (email) => this.readByEmail(email, 'manufacturer');
	searchEmployee = async (searchArgs) => this.search(searchArgs, 'employee');
	searchManufacturer = async (searchArgs) => this.search(searchArgs, 'manufacturer');

	readById = async (id) => {
		const user = (await this.getCollection().doc(id).get()).data();

		if (!user) {
			return null;
		}

		return Immutable.fromJS(user).set('id', id).set('name', dummyName);
	};

	readByEmail = async (email, userType) => {
		let usersReference = this.getCollection().where('email', '==', email);

		if (userType) {
			usersReference = usersReference.where('userType', '==', userType);
		}

		const snapshot = await usersReference.get();
		let users = List();

		if (snapshot.empty) {
			return null;
		}

		snapshot.forEach((user) => {
			users = users.push(Immutable.fromJS(user.data()).set('id', user.id).set('name', dummyName));
		});

		if (users.count() > 1) {
			throw new Error(`Multiple email address ${email} exists in the database!`);
		}

		return users.get(0);
	};

	search = async ({ emails }, userType) => {
		let users = List();

		if (!emails || emails.length === 0) {
			let usersReference = this.getCollection();

			if (userType) {
				usersReference = usersReference.where('userType', '==', userType);
			}

			const snapshot = await usersReference.get();

			if (!snapshot.empty) {
				snapshot.forEach((user) => {
					users = users.push(Immutable.fromJS(user.data()).set('id', user.id).set('name', dummyName));
				});
			}

			return users;
		}

		return Immutable.fromJS(await Promise.all(emails.map((email) => this.readByEmail(email, userType)))).filter((user) => user !== null);
	};
}
