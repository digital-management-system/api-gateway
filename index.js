const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { createServer, setupContainer } = require('./dist');

admin.initializeApp();

const graphql = functions.region('asia-east2', 'asia-northeast1', 'us-central1').https.onRequest((request, response) => {
  createServer().then(server => server(request, response));
});

const onUserSignUp = functions.region('asia-east2', 'asia-northeast1', 'us-central1').firestore.document('/user/{userId}').onCreate((snapshot, context) => {
      const  { userType } = snapshot.data();

       if (userType !== 'manufacturer') {
         return null;
       }

      const userId = context.params.userId;
      const container = setupContainer({user_id: userId});
      const manufacturerBusinessService = container.resolve('manufacturerBusinessService')

      return manufacturerBusinessService.create({userId, name: "no name set yet!!!"});
});

module.exports = {
  graphql,
  onUserSignUp
};
