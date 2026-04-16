// ...existing code...
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave no AsyncStorage
const LAST_SEEN_KEY = '@rufino-pokedex:lastSeen';
const LAST_FAVORITE_KEY = '@rufino-pokedex:lastFavorite';

export type LastSeen = {
    id: number | string;
    name?: string;
    timestamp: number; // unix ms
    // qualquer outro campo necessário (ex: sprite, type, etc)
    [key: string]: unknown;
};

// ...existing code...

/**
 * Salva o último Pokémon favoritado.
 * Pode receber apenas o id (number | string) ou um objeto com mais dados.
 */
export async function saveLastFavorite(pokemon: number | string | Partial<LastSeen>): Promise<LastSeen> {
    const entry: LastSeen = {
        id: typeof pokemon === 'object' && 'id' in pokemon ? (pokemon as any).id : (pokemon as any),
        name: typeof pokemon === 'object' && 'name' in pokemon ? (pokemon as any).name : undefined,
        timestamp: Date.now(),
        ...(typeof pokemon === 'object' ? (pokemon as object) : {}),
    };

    try {
        await AsyncStorage.setItem(LAST_FAVORITE_KEY, JSON.stringify(entry));
        return entry;
    } catch (error) {
        throw new Error('Erro ao salvar último favorito: ' + (error as Error).message);
    }
}

/**
 * Recupera o último Pokémon favoritado. Retorna null se não houver.
 */
export async function getLastFavorite(): Promise<LastSeen | null> {
    try {
        const raw = await AsyncStorage.getItem(LAST_FAVORITE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as LastSeen;
    } catch (error) {
        try { await AsyncStorage.removeItem(LAST_FAVORITE_KEY); } catch {}
        return null;
    }
}

/**
 * Remove o registro de último favorito.
 */
export async function clearLastFavorite(): Promise<void> {
    try {
        await AsyncStorage.removeItem(LAST_FAVORITE_KEY);
    } catch {
        // ignorar falhas silenciosamente ou tratar
    }
}
// ...existing code...