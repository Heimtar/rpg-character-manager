// Это чистый шаблон, с которого будет начинаться создание любого персонажа
export const initialCharacterState = {
  name: '',
  race: 'human',   // дефолтное значение
  class: 'warrior', // дефолтное значение
  stats: {
    strength: 10,
    agility: 10,
    intelligence: 10,
    wisdom: 10,
  },
  availablePoints: 20, // пул очков, которые нужно распределить
};
