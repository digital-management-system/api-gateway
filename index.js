const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { createServer, setupContainer } = require('./dist');

admin.initializeApp();

const graphql = functions.https.onRequest((request, response) => {
  createServer().then(server => server(request, response));
});

const onUserSignUp = functions.firestore.document('/user/{userId}').onCreate((snapshot, context) => {
      const  { userType } = snapshot.data();

       if (userType !== 'manufaturer') {
         return;
       }

      const userId = context.params.userId;
      const container = setupContainer({user_id: userId});
      const manufacturerBusinessService = container.resolve('manufacturerBusinessService')

      manufacturerBusinessService.create({userId, name: "no name set yet!!!"});
});

module.exports = {
  graphql,
  onUserSignUp
};
