// js/LocStorage.js
// Хранилище "ключ: значение" + автосохранение всего объекта в localStorage одним ключом

class LocStorageClass {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.storage = {}; // публично доступное хранилище

        // при старте: пробуем восстановить данные из localStorage
        const saved = localStorage.getItem(this.storageKey);
        if ( saved ) {
            try {
                this.storage = JSON.parse(saved) || {};
            } catch (e) {
                // если в localStorage мусор - начинаем с пустого
                this.storage = {};
            }
        }
    }

    // сохраняю весь объект storage одним JSON в localstorage
    _save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.storage));
    }

    // добавить продукт
    addValue(key, value) {
        this.storage[key] = value;
        this._save();
    }

    // получить продукт по ключу(названию)
    getValue(key) {
        return this.storage[key];
    }

    // удалить продукт
    deleteValue(key) {
        if ( Object.prototype.hasOwnProperty.call(this.storage, key)) {
            delete this.storage[key];
            this._save();
            return true;
        }
        return false;
    }

    // получить список всех продуктов
    getKeys() {
        return Object.keys(this.storage);
    }
}