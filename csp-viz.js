(function() {
	function parseCspString(cspString) {
		if(typeof cspString !== "string") {
			throw "cspString must be a string";
		}

		let policies = {};

		const policyStrings = cspString.trim().split(";");
		for(let policyString of policyStrings) {
			policyString = policyString.trim();
			if(policyString.length === 0) {
				// Skip empty policies
				continue;
			}

			const [directive, ...sources] = policyString.split(" ");
			if(sources.length === 0) {
				// Really should have sources, but I'll allow it and treat
				// it like 'none' since we have the empty array.
			} else if(sources.includes("'none'")) {
				// 'none' should be the only element in this case, but I'll
				// treat it is overriding anything else in the source list.
				sources = [];
			}
			policies[directive] = sources;
		}

		return policies;
	}
})();
