/*eslint-disable no-var,vars-on-top*/
var utils = require('loader-utils');
var defaultId = 'react-component-loader-mount-node';

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
	var result = source;

	var targetScript = target ?
		`var target = document.querySelector(${JSON.stringify(target)});` :
		`var target = document.createElement('div');
		target.id = ${defaultId};
		document.body.appendChild(target);`;

	if (!target) {
		done(new Error('No target to render to'));
	} else {
		result += `
			(function() {
				var React = require('react');
				var canUseDom = !!(
					typeof window !== 'undefined' &&
					window.document && window.document.createElement
				);
				${targetScript}
				if (canUseDom) {
					var ReactDOM = require('react-dom');
					ReactDOM.render(
						React.createElement(exports.default),
						target
					);
				} else {
					var RDS = require('react-dom/server');
					exports.default = RDS.renderToStaticMarkup(React.createElement(exports.default));
				}
			})();
		`;
	}

	done(null, result);
};