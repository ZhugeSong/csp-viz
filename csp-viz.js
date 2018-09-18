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

			let [directive, ...sources] = policyString.split(" ");
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

	function updateTable(policies) {
		let directives = new Set([
			"default-src",
			"img-src",
			"font-src",
			"frame-src",
			"script-src",
			"style-src",
		]);
		let sources = new Set([
			"'self'",
			"'unsafe-inline'",
			"'unsafe-eval'",
			"data:",
		]);
		for(const directive in policies) {
			directives.add(directive);
			for(const source of policies[directive]) {
				sources.add(source);
			}
		}

		const cspVizHeaderRow = document.getElementById("csp-viz-header-row");
		const cspVizSourceRows = document.getElementById("csp-viz-source-rows");
		cspVizHeaderRow.innerHTML = "";
		cspVizSourceRows.innerHTML = "";

		for(const directive of directives) {
			let th = document.createElement("th");
			let code = document.createElement("code");
			code.textContent = directive;
			th.appendChild(code);
			cspVizHeaderRow.appendChild(th);
		}

		for(const source of sources) {
			let tr = document.createElement("tr");
			for(const directive of directives) {
				let td = document.createElement("td");
				let allowed = false;
				if(policies[directive] !== undefined) {
					allowed = policies[directive].includes(source);
				}
				let span = document.createElement("span");
				span.classList.add(allowed ? "allowed" : "not-allowed");
				span.textContent = allowed ? "✔" : "✖";
				let code = document.createElement("code");
				code.textContent = source;
				span.appendChild(code);
				td.appendChild(span);
				tr.appendChild(td);
			}
			cspVizSourceRows.appendChild(tr);
		}
	}

	document.getElementById("csp-viz-form").addEventListener("submit", ev => {
		ev.preventDefault();
		const formData = new FormData(ev.target);
		const cspPolicies = parseCspString(formData.get("csp-text"));
		updateTable(cspPolicies);
	});
})();
