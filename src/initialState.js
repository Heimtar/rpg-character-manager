// Это чистый шаблон, с которого будет начинаться создание любого персонажа
export const initialCharacterState = {
  name: "",
  race: "human", // дефолтное значение
  class: "warrior", // дефолтное значение
  stats: {
    strength: 10,
    agility: 10,
    intelligence: 10,
    wisdom: 10,
  },
  availablePoints: 20, // пул очков, которые нужно распределить
};

// Массивы для случайной генерации (добавь в конец src/initialState.js)
export const RANDOM_NAMES = [
  "Арагорн",
  "Гэндальф",
  "Леголас",
  "Гимли",
  "Фродо",
  "Иллидан",
  "Джайна",
  "Тралл",
  "Артас",
  "Сильвана",
  "Роланд",
  "Мордред",
  "Геральт",
  "Йеннифэр",
  "Цири",
];

export const RANDOM_RACES = ["human", "elf", "dwarf", "orc"];
export const RANDOM_CLASSES = ["warrior", "mage", "rogue"];

// Тестовые персонажи для библиотеки (добавь в конец src/initialState.js)
export const initialLibraryState = [
  {
    id: "test-1",
    name: "Капитан Брутал",
    race: "orc",
    class: "warrior",
    stats: { strength: 18, agility: 12, intelligence: 10, wisdom: 10 },
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: "test-2",
    name: "Эльфийский Глаз",
    race: "elf",
    class: "rogue",
    stats: { strength: 10, agility: 18, intelligence: 12, wisdom: 10 },
    createdAt: new Date().toLocaleDateString(),
  },
];
