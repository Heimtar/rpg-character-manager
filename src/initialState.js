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
