const listeners = new Set<() => void>();

export function emitDataChanged() {
	listeners.forEach((callback) => callback());
}

export function onDataChanged(callback: () => void): () => void {
	listeners.add(callback);
	return () => listeners.delete(callback); // zum Abmelden
}