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

	var query = utils.parseQuery(this.query);
	var target = query.target;

	var targetScript = target ?
		`var target = document.querySelector(${JSON.stringify(target)});` :
		`var target = document.createElement('div');
		target.id = ${JSON.stringify(defaultId)};
		document.body.appendChild(target);`;

	//noinspection JSConstructorReturnsPrimitive
	return source + `
		(function() {
			var React = require('react');
			var canUseDom = !!(
				typeof window !== 'undefined' &&
				window.document && window.document.createElement
			);
			if (canUseDom) {
				${targetScript}
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
};