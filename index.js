var utils = require('loader-utils');

/**
 * ReactPageLoader
 * @param {String} source
 */
module.exports = function ReactPageLoader(source) {
	if (this.cacheable) {
		this.cacheable();
	}
	var done = this.async();

	var query = utils.parseQuery(this.query);
	var target = query.target;

	if (!target) {
		done(new Error('No target to render to'));
	} else {
		source += `
			(function() {
				var React = require('react');
				var canUseDom = !!(
					typeof window !== 'undefined' &&
					window.document && window.document.createElement
				);
				if (canUseDom) {
					var ReactDOM = require('react-dom');
					ReactDOM.render(
						React.createElement(exports.default),
						document.querySelector(${JSON.stringify(target)})
					);
				} else {
					var RDS = require('react-dom/server');
					exports.default = RDS.renderToStaticMarkup(React.createElement(exports.default));
				}
			})();
		`;
	}

	done(null, source);
};