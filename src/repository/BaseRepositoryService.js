import admin from 'firebase-admin';

export default class BaseRepositoryService {
	getUserCollection = () => admin.firestore().collection('user');
	getDepartmentCollection = () => admin.firestore().collection('department');
	getManufacturerCollection = () => admin.firestore().collection('manufacturer');
	getEmployeeCollection = () => admin.firestore().collection('employee');
	getMSOPCollection = () => admin.firestore().collection('msop');
	getActionReferenceCollection = () => admin.firestore().collection('actionReference');
}
