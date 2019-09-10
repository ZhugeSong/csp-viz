(function() {
	function clearLog() {
		const cspVizLog = document.getElementById("csp-viz-log");
		cspVizLog.innerHTML = "";
	}

	/**
	 * @param {string} text
	 */
	function addLogItem(text) {
		const cspVizLog = document.getElementById("csp-viz-log");
		const logItem = document.createElement("li");
		logItem.textContent = text;
		cspVizLog.appendChild(logItem);
	}

	/**
	 * @param {string} cspString
	 */
	function parseCspString(cspString) {
		if(typeof cspString !== "string") {
			addLogItem("Error: cspString must be a string");
			return;
		}

		/** @type { { [direction: string]: string[] } } */
		let policies = {};

		const policyStrings = cspString.trim().split(";");
		for(let policyString of policyStrings) {
			policyString = policyString.trim();
			if(policyString.length === 0) {
				addLogItem("Warning: skipping empty policy");
				continue;
			}

			let [directive, ...sources] = policyString.split(" ");
			if(sources.length === 0) {
				addLogItem("Warning: treating directive \"" + directive + "\" with no sources as having source 'none'");
			} else if(sources.includes("'none'")) {
				if(sources.length > 1) {
					addLogItem("Warning: policy \"" + policyString + "\" contains source \"'none'\" but also other sources; ignoring other sources");
				}
				sources = [];
			}
			policies[directive] = sources;
		}

		return policies;
	}

	/**
	 * @param { { [direction: string]: string[] } } policies
	 */
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
		clearLog();
		const formData = new FormData(ev.target);
		const cspPolicies = parseCspString(formData.get("csp-text"));
		updateTable(cspPolicies);
	});
})();
