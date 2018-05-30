/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import { terms, entities, embedPreviews } from '../reducer';

describe( 'terms()', () => {
	it( 'returns an empty object by default', () => {
		const state = terms( undefined, {} );

		expect( state ).toEqual( {} );
	} );

	it( 'returns with received terms', () => {
		const originalState = deepFreeze( {} );
		const state = terms( originalState, {
			type: 'RECEIVE_TERMS',
			taxonomy: 'categories',
			terms: [ { id: 1 } ],
		} );

		expect( state ).toEqual( {
			categories: [ { id: 1 } ],
		} );
	} );
} );

describe( 'entities', () => {
	it( 'returns the default state for all defined entities', () => {
		const state = entities( undefined, {} );

		expect( state.root.postType ).toEqual( { byKey: {} } );
	} );

	it( 'returns with received post types by slug', () => {
		const originalState = deepFreeze( {} );
		const state = entities( originalState, {
			type: 'RECEIVE_ENTITY_RECORDS',
			records: [ { slug: 'b', title: 'beach' }, { slug: 's', title: 'sun' } ],
			kind: 'root',
			name: 'postType',
		} );

		expect( state.root.postType ).toEqual( {
			byKey: {
				b: { slug: 'b', title: 'beach' },
				s: { slug: 's', title: 'sun' },
			},
		} );
	} );

	it( 'appends the received post types by slug', () => {
		const originalState = deepFreeze( {
			root: {
				postType: {
					byKey: {
						w: { slug: 'w', title: 'water' },
					},
				},
			},
		} );
		const state = entities( originalState, {
			type: 'RECEIVE_ENTITY_RECORDS',
			records: [ { slug: 'b', title: 'beach' } ],
			kind: 'root',
			name: 'postType',
		} );

		expect( state.root.postType ).toEqual( {
			byKey: {
				w: { slug: 'w', title: 'water' },
				b: { slug: 'b', title: 'beach' },
			},
		} );
	} );
} );

describe( 'embedPreviews()', () => {
	it( 'returns an empty object by default', () => {
		const state = embedPreviews( undefined, {} );

		expect( state ).toEqual( {} );
	} );

	it( 'returns with received preview', () => {
		const originalState = deepFreeze( {} );
		const state = embedPreviews( originalState, {
			type: 'RECEIVE_EMBED_PREVIEW',
			url: 'http://twitter.com/notnownikki',
			preview: { data: 42 },
		} );

		expect( state ).toEqual( {
			'http://twitter.com/notnownikki': { data: 42 },
		} );
	} );
} );
