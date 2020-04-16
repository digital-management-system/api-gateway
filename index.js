const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {graphqlServer, graphqlSchemaServer} = require('./dist');

admin.initializeApp();

const graphql = functions.https.onRequest(graphqlServer);

module.exports = {
  graphql
};