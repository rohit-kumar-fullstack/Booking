import { createMMKV, deleteMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
    id: 'app-storage',
    encryptionKey: 'my-secret-key',
});



export const mmkvStorage = {
    setItem: (key: string, value: string) => {
        storage.set(key, value);
        return Promise.resolve(true);
    },

    getItem: (key: string) => {
        const value = storage.getString(key);
        return Promise.resolve(value);
    },

    removeItem: (key: string) => {
        deleteMMKV(key);
        return Promise.resolve();
    },
};