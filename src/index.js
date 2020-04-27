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
} from './business';
import {
	UserRepositoryService,
	ManufacturerRepositoryService,
	DepartmentRepositoryService,
	EmployeeRepositoryService,
	MSOPRepositoryService,
} from './repository';
import {
	getRootQuery,
	getUserType,
	ManufacturerTypeResolver,
	DepartmentTypeResolver,
	RegisteredUserTypeResolver,
	EmployeeTypeResolver,
	ReportingEmployeeTypeResolver,
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
} from './transport/mutation';
import { getRootSchema } from './transport';
import { UserDataLoader, ManufacturerDataLoader, DepartmentDataLoader, EmployeeDataLoader } from './transport/loaders';

const loggingWinston = require('@google-cloud/logging-winston'); // eslint-disable-line no-undef

const setupContainer = (decodedSessionToken) => {
	const container = createContainer();

	container.register({
		logger: asValue(logger),
		decodedSessionToken: asValue(decodedSessionToken),
		userDataLoader: asClass(UserDataLoader).scoped(),
		manufacturerDataLoader: asClass(ManufacturerDataLoader).scoped(),
		departmentDataLoader: asClass(DepartmentDataLoader).scoped(),
		employeeDataLoader: asClass(EmployeeDataLoader).scoped(),
		userBusinessService: asClass(UserBusinessService).scoped(),
		manufacturerBusinessService: asClass(ManufacturerBusinessService).scoped(),
		departmentBusinessService: asClass(DepartmentBusinessService).scoped(),
		userRepositoryService: asClass(UserRepositoryService).scoped(),
		employeeBusinessService: asClass(EmployeeBusinessService).scoped(),
		msopBusinessService: asClass(MSOPBusinessService).scoped(),
		manufacturerRepositoryService: asClass(ManufacturerRepositoryService).scoped(),
		departmentRepositoryService: asClass(DepartmentRepositoryService).scoped(),
		employeeRepositoryService: asClass(EmployeeRepositoryService).scoped(),
		msopRepositoryService: asClass(MSOPRepositoryService).scoped(),
		getRootSchema: asFunction(getRootSchema).scoped(),
		getRootQuery: asFunction(getRootQuery).scoped(),
		getRootMutation: asFunction(getRootMutation).scoped(),
		getUserType: asFunction(getUserType).scoped(),
		manufacturerTypeResolver: asClass(ManufacturerTypeResolver).scoped(),
		departmentTypeResolver: asClass(DepartmentTypeResolver).scoped(),
		registeredUserTypeResolver: asClass(RegisteredUserTypeResolver).scoped(),
		employeeTypeResolver: asClass(EmployeeTypeResolver).scoped(),
		reportingEmployeeTypeResolver: asClass(ReportingEmployeeTypeResolver).scoped(),
		createManufacturer: asFunction(createManufacturer).scoped(),
		updateManufacturer: asFunction(updateManufacturer).scoped(),
		deleteManufacturer: asFunction(deleteManufacturer).scoped(),
		createDepartment: asFunction(createDepartment).scoped(),
		updateDepartment: asFunction(updateDepartment).scoped(),
		deleteDepartment: asFunction(deleteDepartment).scoped(),
		createEmployee: asFunction(createEmployee).scoped(),
		updateEmployee: asFunction(updateEmployee).scoped(),
		deleteEmployee: asFunction(deleteEmployee).scoped(),
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
