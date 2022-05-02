function multi_match(phrase) {
	return {
		query: {
			regexp: {
				research_areas: {
					value: phrase + ".*",
					flags: "ALL",
					case_insensitive: "true",
					max_determinized_states: "10000",
					rewrite: "constant_score",
				},
			},
		},
	};
}

function match_phrase_prefix(phrase) {
	return {
		query: {
			regexp: {
				research_areas: {
					value: phrase + ".*",
					flags: "ALL",
					case_insensitive: "true",
					max_determinized_states: "10000",
					rewrite: "constant_score",
				},
			},
		},
	};
}

const query_string = (phrase) => {
	return {
		query: {
			regexp: {
				research_areas: {
					value: phrase + ".*",
					flags: "ALL",
					case_insensitive: "true",
					max_determinized_states: "10000",
					rewrite: "constant_score",
				},
			},
		},
	};
};

function fuzzy(phrase) {
	return {
		query: {
			regexp: {
				research_areas: {
					value: phrase + ".*",
					flags: "ALL",
					case_insensitive: "true",
					max_determinized_states: "10000",
					rewrite: "constant_score",
				},
			},
		},
	};
}

function query_regexp(phrase) {
	return {
		query: {
			regexp: {
				research_areas: {
					value: phrase + ".*",
					flags: "ALL",
					case_insensitive: "true",
					max_determinized_states: "10000",
					rewrite: "constant_score",
				},
			},
		},
	};
}
