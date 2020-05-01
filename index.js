const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { createServer, handleUserSignUp } = require('./dist');

admin.initializeApp();

const graphql = functions.region('us-central1', 'asia-east2', 'asia-northeast1').https.onRequest((request, response) => {
	createServer().then((server) => server(request, response));
});

const onUserSignUp = functions
	.firestore.document('/user/{userId}')
	.onCreate((snapshot, context) => handleUserSignUp(context.params.userId, snapshot.data()));

module.exports = {
  graphql,
  onUserSignUp
};
