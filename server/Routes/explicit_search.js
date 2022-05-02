const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });

const phraseexplicitSearch = async (search_type, phrase) => {
	const hits = [];
	const search = phrase.split(" ");
	const search_field = search_type;

	// only string values are searchable
	const multi_match_Result = await client
		.search({
			index: "my_test_search",
			type: "_doc",
			body: {
				query: {
					bool: {
						must: [
							{
								multi_match: {
									fields: [search_field + "*"],
									query: phrase[0].toUpperCase() + phrase.slice(1),
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
			if (hits.indexOf(multi_match_Result.body.hits.hits[i]._id) == -1) {
				hits.push(multi_match_Result.body.hits.hits[i]);
			}
		}
	}

	for (i = 0; i < search.length; i++) {
		// only string values are searchable

		const query_string_research_areas_Result = await client
			.search({
				index: "my_test_search",
				type: "_doc",
				body: {
					query: {
						bool: {
							must: [
								{
									query_string: {
										query:
											search[i][0].toUpperCase() + search[i].slice(1) + "*",
										fields: [search_field + "*"],
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
					hits.indexOf(
						query_string_research_areas_Result.body.hits.hits[i]._id
					) == -1
				) {
					hits.push(query_string_research_areas_Result.body.hits.hits[i]);
				}
			}
		}
	}

	return {
		hitsCount: hits.length,
		hits,
	};
};

module.exports = {
	phraseexplicitSearch,
};
