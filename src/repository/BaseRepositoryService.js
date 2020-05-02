import admin from 'firebase-admin';
import Immutable, { List } from 'immutable';

export default class BaseRepositoryService {
	static collectioNames = {
		actionPointPriority: 'actionPointPriority',
		actionPointReference: 'actionPointReference',
		actionPoint: 'actionPoint',
		actionPointStatus: 'actionPointStatus',
		department: 'department',
		employee: 'employee',
		manufacturer: 'manufacturer',
		meetingDay: 'meetingDay',
		meetingFrequency: 'meetingFrequency',
		msop: 'msop',
		user: 'user',
	};

	constructor(collectionName, toDocument, toObject, buildWhereClause) {
		this.collectionName = collectionName;
		this.toDocument = toDocument;
		this.toObject = toObject;
		this.buildWhereClause = buildWhereClause;
	}

	getCollection = (name) => admin.firestore().collection(name);

	getActionPointPriorityCollection = () => this.getCollection(BaseRepositoryService.collectioNames.actionPointPriority);
	getActionPointReferenceCollection = () => this.getCollection(BaseRepositoryService.collectioNames.actionPointReference);
	getActionPointCollection = () => this.getCollection(BaseRepositoryService.collectioNames.actionPoint);
	getActionPointStatusCollection = () => this.getCollection(BaseRepositoryService.collectioNames.actionPointStatus);
	getDepartmentCollection = () => this.getCollection(BaseRepositoryService.collectioNames.department);
	getEmployeeCollection = () => this.getCollection(BaseRepositoryService.collectioNames.employee);
	getManufacturerCollection = () => this.getCollection(BaseRepositoryService.collectioNames.manufacturer);
	getMeetingDayCollection = () => this.getCollection(BaseRepositoryService.collectioNames.meetingDay);
	getMeetingFrequencyCollection = () => this.getCollection(BaseRepositoryService.collectioNames.meetingFrequency);
	getMSOPCollection = () => this.getCollection(BaseRepositoryService.collectioNames.msop);
	getUserCollection = () => this.getCollection(BaseRepositoryService.collectioNames.user);

	create = async (info) => (await this.getCollection(this.collectionName).add(this.toDocument(info))).id;

	read = async (id) => {
		const document = (await this.getCollection(this.collectionName).doc(id).get()).data();

		return document ? this.toObject(document, id) : null;
	};

	update = async ({ id, ...info }) => {
		await this.getCollection(this.collectionName).doc(id).update(this.toDocument(info));

		return id;
	};

	delete = async (id) => {
		await this.getCollection(this.collectionName).doc(id).delete();

		return id;
	};

	search = async (searchCriteria) => {
		const { ids } = searchCriteria;

		if (ids && ids.length > 0) {
			return Immutable.fromJS(await Promise.all(ids.map((id) => this.read(id)))).filter((document) => document !== null);
		}

		const collection = this.buildWhereClause(this.getCollection(this.collectionName), searchCriteria);
		const snapshot = await collection.get();
		let documents = List();

		if (!snapshot.empty) {
			snapshot.forEach((document) => {
				documents = documents.push(this.toObject(document.data(), document.id));
			});
		}

		return documents;
	};
}
