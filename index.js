const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { createServer } = require('./dist');

admin.initializeApp();

const graphql = functions.https.onRequest((request, response) => {
  createServer().then(server => server(request, response));
});

module.exports = {
  graphql
};
