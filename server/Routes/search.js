const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });

const phraseSearch = async (phrase) => {
	const hits = [];
	const search = phrase.split(" ");

	for (i = 0; i < search.length; i++) {
		// only string values are searchable

		console.log(search[i]);
		const multi_match_Result = await client
			.search({
				index: "my_test_csv",
				type: "_doc",
				body: {
					query: {
						bool: {
							must: [
								{
									multi_match: {
										fields: ["research_areas*", "name", "college", "dept"],
										query: search[i][0].toUpperCase() + search[i].slice(1),
									},
								},
							],
							filter: [],
							should: [],
							must_not: [],
						},
					},
				},
			})
			.catch((e) => console.log("errr", e));
		if (
			multi_match_Result &&
			multi_match_Result.body &&
			multi_match_Result.body.hits &&
			multi_match_Result.body.hits.hits &&
			multi_match_Result.body.hits.hits.length > 0
		) {
			for (i = 0; i < multi_match_Result.body.hits.hits.length; i++) {
				if (
					!hits.some(
						(hit) => hit._id === multi_match_Result.body.hits.hits[i]._id
					)
				) {
					hits.push(multi_match_Result.body.hits.hits[i]);
				}
			}
		}
	}

	for (i = 0; i < search.length; i++) {
		// only string values are searchable
		console.log(search[i]);
		const query_string_research_areas_Result = await client
			.search({
				index: "my_test_csv",
				type: "_doc",
				body: {
					query: {
						bool: {
							must: [
								{
									query_string: {
										query:
											search[i][0].toUpperCase() + search[i].slice(1) + "*",
										fields: ["research_areas*", "name", "college", "dept"],
									},
								},
							],
							filter: [],
							should: [],
							must_not: [],
						},
					},
				},
			})
			.catch((e) => console.log("errr", e));
		if (
			query_string_research_areas_Result &&
			query_string_research_areas_Result.body &&
			query_string_research_areas_Result.body.hits &&
			query_string_research_areas_Result.body.hits.hits &&
			query_string_research_areas_Result.body.hits.hits.length > 0
		) {
			for (
				i = 0;
				i < query_string_research_areas_Result.body.hits.hits.length;
				i++
			) {
				if (
					!hits.some(
						(hit) =>
							hit._id ===
							query_string_research_areas_Result.body.hits.hits[i]._id
					)
				) {
					hits.push(query_string_research_areas_Result.body.hits.hits[i]);
				}
			}
		}
	}

	for (i = 0; i < hits.length; i++) {
		console.log(hits[i]._id + "  " + hits[i]._source["name"]);
	}

	return {
		hitsCount: hits.length,
		hits,
	};
};

module.exports = {
	phraseSearch,
};
