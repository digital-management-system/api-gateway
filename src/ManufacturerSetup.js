import { List } from 'immutable';

const actionPointPrioriryNames = List(['Low', 'Normal', 'High', 'Critical']);
const actionPointStatusNames = List(['New', 'In Progress', 'Completed']);
const meetingDayNames = List(['Monday', 'Tuesday', 'Thursday', 'Wednesday', 'Friday', 'Saturday', 'Sunday']);
const meetingFriequencyNames = List(['Daily', 'Weekly', 'Fortnightly', 'Monthly']);

const setupNewManufacturer = ({
	manufacturerBusinessService,
	actionPointPriorityBusinessService,
	actionPointStatusBusinessService,
	meetingDayBusinessService,
	meetingFrequencyBusinessService,
}) => {
	return async (userId) => {
		const manufacturerId = await manufacturerBusinessService.create({ userId, name: 'no name set yet!!!' });

		await Promise.all(actionPointPrioriryNames.map((name) => actionPointPriorityBusinessService.create({ manufacturerId, name })).toArray());
		await Promise.all(actionPointStatusNames.map((name) => actionPointStatusBusinessService.create({ manufacturerId, name })).toArray());
		await Promise.all(meetingDayNames.map((name) => meetingDayBusinessService.create({ manufacturerId, name })).toArray());
		await Promise.all(meetingFriequencyNames.map((name) => meetingFrequencyBusinessService.create({ manufacturerId, name })).toArray());
	};
};

export default setupNewManufacturer;
