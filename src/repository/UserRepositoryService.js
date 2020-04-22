import admin from 'firebase-admin';

export default class UserRepositoryService {
	readEmployee = async (email) => this.readByEmail(email, 'employee');
	readManufacturer = async (email) => this.readByEmail(email, 'manufacturer');
	searchEmployee = async (searchArgs) => this.search(searchArgs, 'employee');
	searchManufacturer = async (searchArgs) => this.search(searchArgs, 'manufacturer');

	readById = async (id) => {
		const document = (await this.getCollection().doc(id).get()).data();

		document.id = document.email;
		document.name = {
			firstName: 'No first name available',
			middleName: 'No middle name available',
			lastName: 'No last name available',
			preferredName: 'No preferred name available',
		};

		return document;
	};

	readByEmail = async (email, userType) => {
		let documentsReference = this.getCollection().where('email', '==', email);

		if (userType) {
			documentsReference = documentsReference.where('userType', '==', userType);
		}

		const snapshot = await documentsReference.get();
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
			let documentsReference = this.getCollection();

			if (userType) {
				documentsReference = documentsReference.where('userType', '==', userType);
			}

			const snapshot = await documentsReference.get();

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

		return await Promise.all(emails.map((email) => this.readByEmail(email, userType)));
	};

	getCollection = () => admin.firestore().collection('user');
}
