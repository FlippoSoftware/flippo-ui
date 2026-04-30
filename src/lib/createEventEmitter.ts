export type EventMap = Record<string, unknown>;

export class EventEmitter<T extends EventMap> {
    private map;

    constructor() {
        this.map = new Map<keyof T, Set<(data: unknown) => void>>();
    }

    /**
     * Регистрирует подписчика на событие.
     * @param event Имя события.
     * @param listener Функция-обработчик.
     * @returns Функция для отписки данного подписчика.
     */
    public on<K extends keyof T>(event: K, listener: (data: T[K]) => void): () => void {
        if (!this.map.has(event)) {
            this.map.set(event, new Set());
        }

        const listeners = this.map.get(event)!;
        // Безопасно приводим тип, так как `emit` будет передавать правильные данные.
        listeners.add(listener as (data: unknown) => void);

        // Возвращаем функцию-деструктор для удобной отписки.
        return () => this.off(event, listener);
    }

    /**
     * Удаляет подписчика с события.
     * @param event Имя события.
     * @param listener Функция-обработчик, которую нужно удалить.
     */
    public off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
        this.map.get(event)?.delete(listener as (data: unknown) => void);
    }

    /**
     * Генерирует событие, вызывая всех его подписчиков.
     * @param event Имя события.
     * @param data Данные, которые будут переданы подписчикам.
     */
    public emit<K extends keyof T>(event: K, data: T[K]): void {
        this.map.get(event)?.forEach((listener) => {
            // `data` здесь имеет тип T[K], а `listener` ожидает `unknown`.
            // Любой тип можно передать в `unknown`, так что это безопасно.
            listener(data);
        });
    }

    /**
     * Регистрирует одноразового подписчика. Он будет удален после первого же вызова.
     * @param event Имя события.
     * @param listener Функция-обработчик.
     * @returns Функция для отписки данного подписчика до его вызова.
     */
    public once<K extends keyof T>(event: K, listener: (data: T[K]) => void): () => void {
        const removeListener = this.on(event, (data) => {
            // Сначала отписываемся, потом вызываем оригинальный listener.
            removeListener();
            listener(data);
        });
        return removeListener;
    }

    /**
     * Удаляет всех подписчиков для указанного события, или для всех событий, если имя не указано.
     * @param event (Опционально) Имя события.
     */
    public removeAllListeners<K extends keyof T>(event?: K): void {
        if (event) {
            this.map.delete(event);
        }
        else {
            this.map.clear();
        }
    }
}
