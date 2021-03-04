// Create Google Sheet with go key in one column and final link in another column
// File > Publish to the web > Entire document as Tab-separated values (tsv)
// Use the key from the resulting link to create Google Chrome custom search engine Query URL

const axios = require("axios");

const express = require("express");
const app = express();

const getRedirectMap = async (key) => {
	const url = `https://docs.google.com/spreadsheets/d/e/${key}/pub?output=tsv`;

	try {
		const redirectMap = {};

		(await axios.get(url)).data.split("\n").forEach((line) => {
			const lineItem = line.split("\t");

			redirectMap[lineItem[0]] = lineItem[1].trim();
		});

		return redirectMap;
	} catch (error) {
		console.error(new Date(), error);
	}
};

app.get("/:key/:go", async function (request, response) {
	const redirectMap = await getRedirectMap(request.params.key);

	if (redirectMap[request.params.go]) response.redirect(302, redirectMap[request.params.go].trim());
	else response.status(404).send("Not found");
});

app.listen(process.env.PORT || 3000, () => {
	console.log(new Date(), "Personal Go Links Started");
});
