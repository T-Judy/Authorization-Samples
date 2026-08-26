import { writable } from 'svelte/store';

function createMessagesStore() {
	const { subscribe, set } = writable({ error: '', success: '' });

	return {
		subscribe,
		setError(message) {
			set({ error: message, success: '' });
		},

		setSuccess(message) {
			set({ error: '', success: message });
		},
		
		clear() {
			set({ error: '', success: '' });
		}
	};
}

export const messages = createMessagesStore();
