const fs = require('fs');
const https = require('https');

const AWS = require('aws-sdk');

// Google sheet and API key

const spreadsheet = `1K6ivS6q0clXiGq78aalmPT1qLDMmDLLiZWkjo_4o9Ts`;
const sheet = `data`;

const key = `AIzaSyDGXvLLoVfz2jGpB7MivDH1jmeT5g4hQEE`;

const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet}/values/${sheet}/?key=${key}`;

// S3 location

const params = {
	Bucket: 'asiasociety-static',
	Key: 'interactive_map/spreadsheetdata/data.json',
};

// For development only. Lambda function should be permissioned

const credentials = require('../credentials.json');

AWS.config.update({
	accessKeyId: credentials.accessKeyId,
	secretAccessKey: credentials.secretAccessKey,
});

// getAndUpload();

//

exports.handler = async (event) => {
	await getAndUpload();

	const response = {
		statusCode: 200,
		body: JSON.stringify({
			message: 'Successfully updated data.',
		}),
	}; 

	return response;
};

async function getAndUpload() {
	const data = await get(url);

	await uploadToS3AsJSON(params, data);
}

function uploadToS3AsJSON(params = {}, data) {
	params.Body = data;
	params.ContentType = 'application/json';

	return new AWS.S3().putObject(params).promise();
}

function get(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			let data = '';

			res.on('data', (d) => {
				data += d;
			});
			res.on('end', () => {
				resolve(data);
			});
		});
	});
}
