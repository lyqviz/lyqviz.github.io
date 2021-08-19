export function getDataFromTable(node) {
	let headers = [];
	let data = [];

	const rows = node.querySelectorAll('tr');

	rows.forEach((row, index) => {
		if (index === 0) {
			headers = getRowHeaders(row);
		} else {
			data.push(getRowData(row, headers));
		}
	});

	return data;
}

function getRowHeaders(row) {
	const headers = [];

	row.querySelectorAll('th').forEach((cell) => {
		headers.push(cell.innerText);
	});

	return headers;
}

function getRowData(row, headers) {
	const data = {};

	row.querySelectorAll('td').forEach((cell, index) => {
		data[headers[index]] = cell.innerText;
	});

	return data;
}
