import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import GraphQLHTTP from 'express-graphql';
import cors from 'cors';
import admin from 'firebase-admin';
import { asValue, asFunction, asClass, createContainer } from 'awilix';

import logger from './Logger';
import {
	ActionPointPriorityBusinessService,
	ActionPointReferenceBusinessService,
	ActionPointBusinessService,
	ActionPointStatusBusinessService,
	DepartmentBusinessService,
	EmployeeBusinessService,
	ManufacturerBusinessService,
	MeetingDayBusinessService,
	MeetingDurationBusinessService,
	MeetingFrequencyBusinessService,
	MSOPBusinessService,
	UserBusinessService,
} from './business';
import {
	ActionPointPriorityRepositoryService,
	ActionPointReferenceRepositoryService,
	ActionPointRepositoryService,
	ActionPointStatusRepositoryService,
	DepartmentRepositoryService,
	EmployeeRepositoryService,
	ManufacturerRepositoryService,
	MeetingDayRepositoryService,
	MeetingDurationRepositoryService,
	MeetingFrequencyRepositoryService,
	MSOPRepositoryService,
	UserRepositoryService,
} from './repository';
import {
	convertToRelayConnection,
	getRootQuery,
	getUserType,
	ActionPointPriorityTypeResolver,
	ActionPointReferenceTypeResolver,
	ActionPointStatusTypeResolver,
	ActionPointTypeResolver,
	ActionPointWithoutMSOPTypeResolver,
	DepartmentTypeResolver,
	EmployeeTypeResolver,
	EmployeeWithoutDepartmentTypeResolver,
	ManufacturerTypeResolver,
	MeetingDayTypeResolver,
	MeetingDurationTypeResolver,
	MeetingFrequencyTypeResolver,
	MSOPTypeResolver,
	RegisteredUserTypeResolver,
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
	createMSOP,
	updateMSOP,
	deleteMSOP,
	createActionPoint,
	updateActionPoint,
	deleteActionPoint,
	createActionPointPriority,
	updateActionPointPriority,
	deleteActionPointPriority,
	createActionPointReference,
	updateActionPointReference,
	deleteActionPointReference,
	createActionPointStatus,
	updateActionPointStatus,
	deleteActionPointStatus,
	createMeetingFrequency,
	updateMeetingFrequency,
	deleteMeetingFrequency,
	createMeetingDay,
	updateMeetingDay,
	deleteMeetingDay,
	createMeetingDuration,
	updateMeetingDuration,
	deleteMeetingDuration,
} from './transport/mutation';
import { getRootSchema } from './transport';
import {
	ActionPointPriorityDataLoader,
	ActionPointReferenceDataLoader,
	ActionPointDataLoader,
	ActionPointStatusDataLoader,
	DepartmentDataLoader,
	EmployeeDataLoader,
	ManufacturerDataLoader,
	MeetingDayDataLoader,
	MeetingDurationDataLoader,
	MeetingFrequencyDataLoader,
	MSOPDataLoader,
	UserDataLoader,
} from './loaders';
import setupNewManufacturer from './ManufacturerSetup';

const loggingWinston = require('@google-cloud/logging-winston'); // eslint-disable-line no-undef

const setupContainer = (decodedSessionToken) => {
	const container = createContainer();

	container.register({
		logger: asValue(logger),
		decodedSessionToken: asValue(decodedSessionToken),
		setupNewManufacturer: asFunction(setupNewManufacturer),

		actionPointPriorityRepositoryService: asClass(ActionPointPriorityRepositoryService).scoped(),
		actionPointReferenceRepositoryService: asClass(ActionPointReferenceRepositoryService).scoped(),
		actionPointRepositoryService: asClass(ActionPointRepositoryService).scoped(),
		actionPointStatusRepositoryService: asClass(ActionPointStatusRepositoryService).scoped(),
		departmentRepositoryService: asClass(DepartmentRepositoryService).scoped(),
		employeeRepositoryService: asClass(EmployeeRepositoryService).scoped(),
		manufacturerRepositoryService: asClass(ManufacturerRepositoryService).scoped(),
		meetingDayRepositoryService: asClass(MeetingDayRepositoryService).scoped(),
		meetingDurationRepositoryService: asClass(MeetingDurationRepositoryService).scoped(),
		meetingFrequencyRepositoryService: asClass(MeetingFrequencyRepositoryService).scoped(),
		msopRepositoryService: asClass(MSOPRepositoryService).scoped(),
		userRepositoryService: asClass(UserRepositoryService).scoped(),

		actionPointPriorityBusinessService: asClass(ActionPointPriorityBusinessService).scoped(),
		actionPointReferenceBusinessService: asClass(ActionPointReferenceBusinessService).scoped(),
		actionPointBusinessService: asClass(ActionPointBusinessService).scoped(),
		actionPointStatusBusinessService: asClass(ActionPointStatusBusinessService).scoped(),
		departmentBusinessService: asClass(DepartmentBusinessService).scoped(),
		employeeBusinessService: asClass(EmployeeBusinessService).scoped(),
		manufacturerBusinessService: asClass(ManufacturerBusinessService).scoped(),
		meetingDayBusinessService: asClass(MeetingDayBusinessService).scoped(),
		meetingDurationBusinessService: asClass(MeetingDurationBusinessService).scoped(),
		meetingFrequencyBusinessService: asClass(MeetingFrequencyBusinessService).scoped(),
		msopBusinessService: asClass(MSOPBusinessService).scoped(),
		userBusinessService: asClass(UserBusinessService).scoped(),

		actionPointPriorityDataLoader: asClass(ActionPointPriorityDataLoader).scoped(),
		actionPointReferenceDataLoader: asClass(ActionPointReferenceDataLoader).scoped(),
		actionPointDataLoader: asClass(ActionPointDataLoader).scoped(),
		actionPointStatusDataLoader: asClass(ActionPointStatusDataLoader).scoped(),
		departmentDataLoader: asClass(DepartmentDataLoader).scoped(),
		employeeDataLoader: asClass(EmployeeDataLoader).scoped(),
		manufacturerDataLoader: asClass(ManufacturerDataLoader).scoped(),
		meetingDayDataLoader: asClass(MeetingDayDataLoader).scoped(),
		meetingDurationDataLoader: asClass(MeetingDurationDataLoader).scoped(),
		meetingFrequencyDataLoader: asClass(MeetingFrequencyDataLoader).scoped(),
		msopDataLoader: asClass(MSOPDataLoader).scoped(),
		userDataLoader: asClass(UserDataLoader).scoped(),

		convertToRelayConnection: asFunction(convertToRelayConnection).scoped(),
		getRootSchema: asFunction(getRootSchema).scoped(),
		getRootQuery: asFunction(getRootQuery).scoped(),
		getUserType: asFunction(getUserType).scoped(),

		actionPointPriorityTypeResolver: asClass(ActionPointPriorityTypeResolver).scoped(),
		actionPointReferenceTypeResolver: asClass(ActionPointReferenceTypeResolver).scoped(),
		actionPointStatusTypeResolver: asClass(ActionPointStatusTypeResolver).scoped(),
		actionPointTypeResolver: asClass(ActionPointTypeResolver).scoped(),
		actionPointWithoutMSOPTypeResolver: asClass(ActionPointWithoutMSOPTypeResolver).scoped(),
		departmentTypeResolver: asClass(DepartmentTypeResolver).scoped(),
		employeeTypeResolver: asClass(EmployeeTypeResolver).scoped(),
		employeeWithoutDepartmentTypeResolver: asClass(EmployeeWithoutDepartmentTypeResolver).scoped(),
		manufacturerTypeResolver: asClass(ManufacturerTypeResolver).scoped(),
		meetingDayTypeResolver: asClass(MeetingDayTypeResolver).scoped(),
		meetingDurationTypeResolver: asClass(MeetingDurationTypeResolver).scoped(),
		meetingFrequencyTypeResolver: asClass(MeetingFrequencyTypeResolver).scoped(),
		msopTypeResolver: asClass(MSOPTypeResolver).scoped(),
		registeredUserTypeResolver: asClass(RegisteredUserTypeResolver).scoped(),
		reportingEmployeeTypeResolver: asClass(ReportingEmployeeTypeResolver).scoped(),

		getRootMutation: asFunction(getRootMutation).scoped(),

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

		createActionPoint: asFunction(createActionPoint).scoped(),
		updateActionPoint: asFunction(updateActionPoint).scoped(),
		deleteActionPoint: asFunction(deleteActionPoint).scoped(),

		createActionPointPriority: asFunction(createActionPointPriority).scoped(),
		updateActionPointPriority: asFunction(updateActionPointPriority).scoped(),
		deleteActionPointPriority: asFunction(deleteActionPointPriority).scoped(),

		createActionPointReference: asFunction(createActionPointReference).scoped(),
		updateActionPointReference: asFunction(updateActionPointReference).scoped(),
		deleteActionPointReference: asFunction(deleteActionPointReference).scoped(),

		createActionPointStatus: asFunction(createActionPointStatus).scoped(),
		updateActionPointStatus: asFunction(updateActionPointStatus).scoped(),
		deleteActionPointStatus: asFunction(deleteActionPointStatus).scoped(),

		createMeetingFrequency: asFunction(createMeetingFrequency).scoped(),
		updateMeetingFrequency: asFunction(updateMeetingFrequency).scoped(),
		deleteMeetingFrequency: asFunction(deleteMeetingFrequency).scoped(),

		createMeetingDay: asFunction(createMeetingDay).scoped(),
		updateMeetingDay: asFunction(updateMeetingDay).scoped(),
		deleteMeetingDay: asFunction(deleteMeetingDay).scoped(),

		createMeetingDuration: asFunction(createMeetingDuration).scoped(),
		updateMeetingDuration: asFunction(updateMeetingDuration).scoped(),
		deleteMeetingDuration: asFunction(deleteMeetingDuration).scoped(),
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

const handleUserSignUp = async (userId, { userType }) => {
	if (userType !== 'manufacturer') {
		return null;
	}

	const container = setupContainer({ user_id: userId });
	const setupNewManufacturer = container.resolve('setupNewManufacturer');

	await setupNewManufacturer(userId);
};

export { createServer, setupContainer, handleUserSignUp };
