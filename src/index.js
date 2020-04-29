import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import GraphQLHTTP from 'express-graphql';
import cors from 'cors';
import admin from 'firebase-admin';
import { asValue, asFunction, asClass, createContainer } from 'awilix';

import logger from './Logger';
import {
	UserBusinessService,
	ManufacturerBusinessService,
	DepartmentBusinessService,
	EmployeeBusinessService,
	MSOPBusinessService,
	ActionReferenceBusinessService,
} from './business';
import {
	UserRepositoryService,
	ManufacturerRepositoryService,
	DepartmentRepositoryService,
	EmployeeRepositoryService,
	MSOPRepositoryService,
	ActionReferenceRepositoryService,
} from './repository';
import {
	getRootQuery,
	getUserType,
	ManufacturerTypeResolver,
	DepartmentTypeResolver,
	RegisteredUserTypeResolver,
	EmployeeTypeResolver,
	ReportingEmployeeTypeResolver,
	MSOPTypeResolver,
	ActionReferenceTypeResolver,
} from './transport/query';
import {
	getRootMutation,
	createManufacturer,
	updateManufacturer,
	deleteManufacturer,
	createDepartment,
	updateDepartment,
	deleteDepartment,
	createEmployee,
	updateEmployee,
	deleteEmployee,
	createMSOP,
	updateMSOP,
	deleteMSOP,
	createActionReference,
	updateActionReference,
	deleteActionReference,
} from './transport/mutation';
import { getRootSchema } from './transport';
import {
	UserDataLoader,
	ManufacturerDataLoader,
	DepartmentDataLoader,
	EmployeeDataLoader,
	MSOPDataLoader,
	ActionReferenceDataLoader,
} from './transport/loaders';

const loggingWinston = require('@google-cloud/logging-winston'); // eslint-disable-line no-undef

const setupContainer = (decodedSessionToken) => {
	const container = createContainer();

	container.register({
		logger: asValue(logger),
		decodedSessionToken: asValue(decodedSessionToken),

		userDataLoader: asClass(UserDataLoader).scoped(),
		userBusinessService: asClass(UserBusinessService).scoped(),
		userRepositoryService: asClass(UserRepositoryService).scoped(),

		manufacturerDataLoader: asClass(ManufacturerDataLoader).scoped(),
		manufacturerBusinessService: asClass(ManufacturerBusinessService).scoped(),
		manufacturerRepositoryService: asClass(ManufacturerRepositoryService).scoped(),

		departmentDataLoader: asClass(DepartmentDataLoader).scoped(),
		departmentBusinessService: asClass(DepartmentBusinessService).scoped(),
		departmentRepositoryService: asClass(DepartmentRepositoryService).scoped(),

		employeeDataLoader: asClass(EmployeeDataLoader).scoped(),
		employeeBusinessService: asClass(EmployeeBusinessService).scoped(),
		employeeRepositoryService: asClass(EmployeeRepositoryService).scoped(),

		msopDataLoader: asClass(MSOPDataLoader).scoped(),
		msopBusinessService: asClass(MSOPBusinessService).scoped(),
		msopRepositoryService: asClass(MSOPRepositoryService).scoped(),

		actionReferenceDataLoader: asClass(ActionReferenceDataLoader).scoped(),
		actionReferenceBusinessService: asClass(ActionReferenceBusinessService).scoped(),
		actionReferenceRepositoryService: asClass(ActionReferenceRepositoryService).scoped(),

		getRootSchema: asFunction(getRootSchema).scoped(),
		getRootQuery: asFunction(getRootQuery).scoped(),
		getRootMutation: asFunction(getRootMutation).scoped(),
		getUserType: asFunction(getUserType).scoped(),

		manufacturerTypeResolver: asClass(ManufacturerTypeResolver).scoped(),
		departmentTypeResolver: asClass(DepartmentTypeResolver).scoped(),
		registeredUserTypeResolver: asClass(RegisteredUserTypeResolver).scoped(),
		employeeTypeResolver: asClass(EmployeeTypeResolver).scoped(),
		reportingEmployeeTypeResolver: asClass(ReportingEmployeeTypeResolver).scoped(),
		msopTypeResolver: asClass(MSOPTypeResolver).scoped(),
		actionReferenceTypeResolver: asClass(ActionReferenceTypeResolver).scoped(),

		createManufacturer: asFunction(createManufacturer).scoped(),
		updateManufacturer: asFunction(updateManufacturer).scoped(),
		deleteManufacturer: asFunction(deleteManufacturer).scoped(),

		createDepartment: asFunction(createDepartment).scoped(),
		updateDepartment: asFunction(updateDepartment).scoped(),
		deleteDepartment: asFunction(deleteDepartment).scoped(),

		createEmployee: asFunction(createEmployee).scoped(),
		updateEmployee: asFunction(updateEmployee).scoped(),
		deleteEmployee: asFunction(deleteEmployee).scoped(),

		createMSOP: asFunction(createMSOP).scoped(),
		updateMSOP: asFunction(updateMSOP).scoped(),
		deleteMSOP: asFunction(deleteMSOP).scoped(),

		createActionReference: asFunction(createActionReference).scoped(),
		updateActionReference: asFunction(updateActionReference).scoped(),
		deleteActionReference: asFunction(deleteActionReference).scoped(),
	});

	return container;
};

const createServer = async () => {
	const expressServer = express();

	expressServer.use(cors());
	expressServer.use(await loggingWinston.express.makeMiddleware(logger));
	expressServer.use('*', async (request, response) => {
		const developmentUserId = process.env.FIREBASE_USER_ID; // eslint-disable-line no-undef
		let decodedSessionToken;

		if (developmentUserId) {
			decodedSessionToken = { user_id: developmentUserId };
		} else {
			if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) {
				response.send(401);

				return;
			}

			try {
				const token = request.headers.authorization;

				decodedSessionToken = await admin.auth().verifyIdToken(token.substring('Bearer '.length, token.length));
			} catch {
				response.send(401);

				return;
			}
		}

		const container = setupContainer(decodedSessionToken);

		return GraphQLHTTP({
			schema: container.resolve('getRootSchema'),
			customFormatErrorFn: (error) => {
				return {
					message: error.message,
					locations: error.locations,
					stack: error.stack ? error.stack.split('\n') : [],
					path: error.path,
				};
			},
			graphiql: true,
		})(request, response);
	});

	return expressServer;
};

export { createServer, setupContainer };
