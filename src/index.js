import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import GraphQLHTTP from 'express-graphql';
import cors from 'cors';
import { asValue, asFunction, asClass, createContainer } from 'awilix';

import logger from './Logger';
import { UserService as UserBusinessService, DepartmentService as DepartmentBusinessService } from './business';
import { getRootQuery, getUserType, DepartmentTypeResolver, EmployeeTypeResolver } from './transport/query';
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
import { createDepartmentLoaderById, createEmployeeLoaderById } from './transport/loaders';

const loggingWinston = require('@google-cloud/logging-winston');
const container = createContainer();

container.register({
	logger: asValue(logger),
	createDepartmentLoaderById: asFunction(createDepartmentLoaderById).scoped(),
	createEmployeeLoaderById: asFunction(createEmployeeLoaderById).scoped(),
	userBusinessService: asClass(UserBusinessService).scoped(),
	departmentBusinessService: asClass(DepartmentBusinessService).scoped(),
	getRootSchema: asFunction(getRootSchema).scoped(),
	getRootQuery: asFunction(getRootQuery).scoped(),
	getRootMutation: asFunction(getRootMutation).scoped(),
	getUserType: asFunction(getUserType).scoped(),
	departmentTypeResolver: asClass(DepartmentTypeResolver).scoped(),
	employeeTypeResolver: asClass(EmployeeTypeResolver).scoped(),
	createDepartment: asFunction(createDepartment).scoped(),
	updateDepartment: asFunction(updateDepartment).scoped(),
	deleteDepartment: asFunction(deleteDepartment).scoped(),
	createEmployee: asFunction(createEmployee).scoped(),
	updateEmployee: asFunction(updateEmployee).scoped(),
	deleteEmployee: asFunction(deleteEmployee).scoped(),
});

const createServer = async () => {
	const expressServer = express();

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
				dataLoaders: {
					departmentLoaderById: container.resolve('createDepartmentLoaderById'),
					employeeLoaderById: container.resolve('createEmployeeLoaderById'),
				},
			},
		})(request, response);
	});

	return expressServer;
};

export { createServer, container };
