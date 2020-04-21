import admin from 'firebase-admin';

export default class UserRepositoryService {
	readEmployee = async (email) => this.read(email, 'employee');
	readManufacturer = async (email) => this.read(email, 'manufacturer');
	searchEmployee = async (searchArgs) => this.search(searchArgs, 'employee');
	searchManufacturer = async (searchArgs) => this.search(searchArgs, 'manufacturer');

	read = async (email, userType) => {
		const snapshot = await this.getCollection().where('email', '==', email).where('userType', '==', userType).get();
		let documents = [];

		if (snapshot.empty) {
			throw new Error(`Email address ${email} does not exist!`);
		}

		snapshot.forEach((document) => {
			documents.push(document.data());
		});

		if (documents.length > 1) {
			throw new Error(`Multiple email address ${email} exists in the database!`);
		}

		const document = documents[0];

		document.id = document.email;
		document.name = {
			firstName: 'No first name available',
			middleName: 'No middle name available',
			lastName: 'No last name available',
			preferredName: 'No preferred name available',
		};

		return document;
	};

	search = async ({ emails }, userType) => {
		let documents = [];

		if (!emails || emails.length === 0) {
			const snapshot = await this.getCollection().where('userType', '==', userType).get();

			if (!snapshot.empty) {
				snapshot.forEach((document) => {
					documents.push(document.data());
				});
			}

			return documents.map((document) => {
				document.id = document.email;
				document.name = {
					firstName: 'No first name available',
					middleName: 'No middle name available',
					lastName: 'No last name available',
					preferredName: 'No preferred name available',
				};

				return document;
			});
		}

		return await Promise.all(emails.map((email) => this.read(email, userType)));
	};

	getCollection = () => admin.firestore().collection('user');
}
