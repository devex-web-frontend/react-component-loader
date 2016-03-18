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
	var isStatic = query.isStatic;

	if (isStatic) {
		source += `
			(function() {
				var RDS = require('react-dom/server');
				var React = require('react');
				exports.default = RDS.renderToStaticMarkup(React.createElement(exports.default));
			})();
		`;
		done(null, source);
	} else {
		if (!target) {
			done(new Error('No target to render to'));
		} else {
			source += `
				(function() {
					var ReactDOM = require('react-dom');
					var React = require('react');
					ReactDOM.render(
						React.createElement(exports.default),
						document.querySelector(${JSON.stringify(target)})
					);
				})();
			`;
		}
		
		done(null, source);
	}
};