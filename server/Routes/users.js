function data_processing(Result) {
	const data = [];

	// console.log("enter in data processing");
	// console.log(Result.length)
	if (Result.length > 0) {
		for (i = 0; i < Result.length; i++) {
			console.log(Result[i].length);
			if (Result[i].length > 0) {
				console.log("hello");
				for (j = 0; j < Result[i].length; j++) {
					// console.log(Result[i][j])
					if (!data.some((hit) => hit._id === Result[i][j]._id)) {
						// console.log(Result[i][j]._id  + "   "  + Result[i][j]._source["name"])

						if (!Result[i][j]._source.hasOwnProperty("position")) {
							Result[i][j]._source["position"] = [null];
						} else {
							Result[i][j]._source["position"] = Result[i][j]._source[
								"position"
							].split(",");
						}

						if (!Result[i][j]._source.hasOwnProperty("research_areas")) {
							Result[i][j]._source["research_areas"] = [null];
						} else {
							Result[i][j]._source["research_areas"] = Result[i][j]._source[
								"research_areas"
							].split(",");
						}

						if (!Result[i][j]._source.hasOwnProperty("email")) {
							Result[i][j]._source["email"] = null;
						}

						if (!Result[i][j]._source.hasOwnProperty("phone")) {
							Result[i][j]._source["phone"] = null;
						}

						data.push(Result[i][j]);
					}
				}
				// console.log(data.length)
				console.log("End of loop");
				console.log("");
				console.log("");
				console.log("");
			}
		}

		return {
			hitCount: data.length,
			data,
		};
	}
}

const userRoutes = (app, fs) => {
	// variables
	const { multi_match_Search_csv } = require("./Search_csv");

	// READ Faculty name
	app.get("/search", async (req, res) => {
		const { phraseSearch } = require("./search");
		const data = await phraseSearch(req.query.q);
		res.json(data);
	});

	app.get("/explicit_search/:field", async (req, res) => {
		const { phraseexplicitSearch } = require("./explicit_search");
		const data = phraseexplicitSearch(req.params.field, req.query.q);
		res.json(data);
	});

	app.get("/search_csv", async (req, res) => {
		let phrase = req.query.q.toUpperCase();
		const search = [];
		search[0] = phrase;
		// const search = phrase.split(" ");
		// if (phrase.split(" ").length > 1) {
		//   search.push(...phrase.split(" "));
		// }

		if (phrase.split(" ").length > 1) {
			for (i = 0; i < phrase.split(" ").length; i++) {
				console.log(phrase.split(" ")[i]);
				if (
					phrase.split(" ")[i] !== "AND" &&
					phrase.split(" ")[i] !== "OR" &&
					phrase.split(" ")[i] !== "THE" &&
					phrase.split(" ")[i] !== "IN" &&
					phrase.split(" ")[i] !== "AN" &&
					phrase.split(" ")[i] !== "A" &&
					phrase.split(" ")[i] !== "WITH"
				) {
					search.push(phrase.split(" ")[i]);
				}
			}
		}

		console.log(search);

		console.log("Start");

		try {
			const promises = search.map(async (searchdata) => {
				const temp = await multi_match_Search_csv(searchdata);
				return temp;
			});

			const data = await Promise.all(promises);
			const hits = data_processing(data);

			console.log("End");
			console.log("exite api call");

			res.json(hits);
		} catch (e) {
			console.log(e);
			res.json(e);
		}
	});
};

module.exports = userRoutes;
