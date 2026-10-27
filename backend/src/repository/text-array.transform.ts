// Конвертер между строкой и массивом строк в TypeScript
export const TextArrayTransformer = {
  // Массив -> строка для записи в БД
  to: (value?: string[]): string =>
    Array.isArray(value) ? value.join(',') : '',

  // Строка из БД -> массив (null и '' превращаются в пустой массив)
  from: (value: string | null): string[] => (value ? value.split(',') : []),
};
