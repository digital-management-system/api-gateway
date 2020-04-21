import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import GraphQLHTTP from 'express-graphql';
import cors from 'cors';
import { asValue, asFunction, asClass, createContainer } from 'awilix';

import logger from './Logger';
import { UserBusinessService, DepartmentBusinessService, EmployeeBusinessService } from './business';
import { UserRepositoryService, DepartmentRepositoryService, EmployeeRepositoryService } from './repository';
import { getRootQuery, getUserType, DepartmentTypeResolver, RegisteredUserTypeResolver, EmployeeTypeResolver } from './transport/query';
import {
	getRootMutation,
	createDepartment,
	updateDepartment,
	deleteDepartment,
	createEmployee,
	updateEmployee,
	deleteEmployee,
} from './transport/mutation';
import { getRootSchema } from './transport';
import {
	createDepartmentLoaderById,
	createEmployeeUserTypeLoaderByEmail,
	createManufacturerUserTypeLoaderByEmail,
	createEmployeeLoaderById,
} from './transport/loaders';

const loggingWinston = require('@google-cloud/logging-winston');

const setupContainer = () => {
	const container = createContainer();

	container.register({
		logger: asValue(logger),
		departmentLoaderById: asFunction(createDepartmentLoaderById).scoped(),
		createEmployeeUserTypeLoaderByEmail: asFunction(createEmployeeUserTypeLoaderByEmail).scoped(),
		createManufacturerUserTypeLoaderByEmail: asFunction(createManufacturerUserTypeLoaderByEmail).scoped(),
		employeeLoaderById: asFunction(createEmployeeLoaderById).scoped(),
		userBusinessService: asClass(UserBusinessService).scoped(),
		departmentBusinessService: asClass(DepartmentBusinessService).scoped(),
		userRepositoryService: asClass(UserRepositoryService).scoped(),
		employeeBusinessService: asClass(EmployeeBusinessService).scoped(),
		departmentRepositoryService: asClass(DepartmentRepositoryService).scoped(),
		employeeRepositoryService: asClass(EmployeeRepositoryService).scoped(),
		getRootSchema: asFunction(getRootSchema).scoped(),
		getRootQuery: asFunction(getRootQuery).scoped(),
		getRootMutation: asFunction(getRootMutation).scoped(),
		getUserType: asFunction(getUserType).scoped(),
		departmentTypeResolver: asClass(DepartmentTypeResolver).scoped(),
		registeredUserTypeResolver: asClass(RegisteredUserTypeResolver).scoped(),
		employeeTypeResolver: asClass(EmployeeTypeResolver).scoped(),
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
	const container = setupContainer();

	expressServer.use(cors());
	expressServer.use(await loggingWinston.express.makeMiddleware(container.resolve('logger')));
	expressServer.use('*', async (request, response) => {
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
			context: {
				request,
				sessionToken: request.headers.authorization,
			},
		})(request, response);
	});

	return expressServer;
};

export { createServer, setupContainer };
