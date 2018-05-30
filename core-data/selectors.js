/**
 * External dependencies
 */
import createSelector from 'rememo';
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { REDUCER_KEY } from './';

/**
 * Returns true if resolution is in progress for the core selector of the given
 * name and arguments.
 *
 * @param {string} selectorName Core data selector name.
 * @param {...*}   args         Arguments passed to selector.
 *
 * @return {boolean} Whether resolution is in progress.
 */
function isResolving( selectorName, ...args ) {
	return select( 'core/data' ).isResolving( REDUCER_KEY, selectorName, ...args );
}

/**
 * Returns all the available terms for the given taxonomy.
 *
 * @param {Object} state    Data state.
 * @param {string} taxonomy Taxonomy name.
 *
 * @return {Array} Categories list.
 */
export function getTerms( state, taxonomy ) {
	return state.terms[ taxonomy ];
}

/**
 * Returns all the available categories.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Categories list.
 */
export function getCategories( state ) {
	return getTerms( state, 'categories' );
}

/**
 * Returns true if a request is in progress for terms data of a given taxonomy,
 * or false otherwise.
 *
 * @param {Object} state    Data state.
 * @param {string} taxonomy Taxonomy name.
 *
 * @return {boolean} Whether a request is in progress for taxonomy's terms.
 */
export function isRequestingTerms( state, taxonomy ) {
	return isResolving( 'getTerms', taxonomy );
}

/**
 * Returns true if a request is in progress for categories data, or false
 * otherwise.
 *
 * @param {Object} state Data state.
 *
 * @return {boolean} Whether a request is in progress for categories.
 */
export function isRequestingCategories() {
	return isResolving( 'getCategories' );
}

/**
 * Returns all available authors.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Authors list.
 */
export function getAuthors( state ) {
	return getUserQueryResults( state, 'authors' );
}

/**
 * Returns all the users returned by a query ID.
 *
 * @param {Object} state   Data state.
 * @param {string} queryID Query ID.
 *
 * @return {Array} Users list.
 */
export const getUserQueryResults = createSelector(
	( state, queryID ) => {
		const queryResults = state.users.queries[ queryID ];

		return map( queryResults, ( id ) => state.users.byId[ id ] );
	},
	( state, queryID ) => [ state.users.queries[ queryID ], state.users.byId ]
);

/**
 * Returns the Entity's record object by key.
 *
 * @param {Object} state  State tree
 * @param {string} kind   Entity kind.
 * @param {string} name   Entity name.
 * @param {number} key    Record's key
 *
 * @return {Object?} Record.
 */
export function getEntityRecord( state, kind, name, key ) {
	return state.entities[ kind ][ name ].byKey[ key ];
}

/**
 * Returns the Entity's records.
 *
 * @param {Object} state  State tree
 * @param {string} kind   Entity kind.
 * @param {string} name   Entity name.
 *
 * @return {Array} Records.
 */
export const getEntityRecords = createSelector(
	( state, kind, name ) => {
		return Object.values( state.entities[ kind ][ name ].byKey );
	},
	( state, kind, name ) => ( [
		state.entities[ kind ][ name ].byKey,
	]	)
);

/**
 * Return theme suports data in the index.
 *
 * @param {Object} state Data state.
 *
 * @return {*}           Index data.
 */
export function getThemeSupports( state ) {
	return state.themeSupports;
}

/**
 * Returns the embed preview for the given URL.
 *
 * @param {Object} state    Data state.
 * @param {string} url      Embedded URL.
 *
 * @return {Mixed} Undefined if the preview has not been fetched, false if the URL cannot be embedded, array of embed preview data if the preview has been fetched.
 */
export function getPreview( state, url ) {
	const preview = state.embedPreviews[ url ];

	if ( ! preview ) {
		return preview;
	}

	const oEmbedLinkCheck = '<a href="' + url + '">' + url + '</a>';

	if ( oEmbedLinkCheck === preview.html ) {
		// just a link to the url, it's oEmbed being helpful and creating a link for us, not actually embedding content
		return false;
	}

	return preview;
}
