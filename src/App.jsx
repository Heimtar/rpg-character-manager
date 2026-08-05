import { useState } from "react";
import { initialCharacterState } from "./initialState";
import "./App.css";

function App() {
  const [character, setCharacter] = useState(initialCharacterState);

  // Изменение характеристик (без изменений)
  const changeStat = (statName, amount) => {
    if (amount === 1 && character.availablePoints === 0) return;
    if (amount === -1 && character.stats[statName] === 10) return;

    setCharacter((prev) => ({
      ...prev,
      availablePoints: prev.availablePoints - amount,
      stats: {
        ...prev.stats,
        [statName]: prev.stats[statName] + amount,
      },
    }));
  };

  // Универсальный обработчик для имени, расы и класса (теперь обрабатывает и текст)
  const handleInputChange = (fieldName, value) => {
    setCharacter((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Валидация: проверяем, заполнено ли имя и распределены ли все очки (осталось 0)
  const isFormInvalid =
    character.name.trim() === "" || character.availablePoints > 0;

  // Функция имитации сохранения (пока просто выводим в консоль)
  const handleSave = () => {
    if (isFormInvalid) return; // дополнительная защита
    console.log("Персонаж успешно создан и готов к сохранению:", character);
    alert(`Персонаж ${character.name} успешно создан!`);
  };

  return (
    <div className="app-container">
      <h1>Генератор Персонажа RPG</h1>

      <div className="creator-card">
        {/* НОВЫЙ БЛОК: Ввод имени */}
        <div className="form-group name-group">
          <label htmlFor="char-name">✍️ Имя персонажа: </label>
          <input
            id="char-name"
            type="text"
            placeholder="Введите имя героя..."
            value={character.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>

        {/* Выбор Расы и Класса */}
        <div className="dropdowns-container">
          <div className="form-group">
            <label htmlFor="race-select">🧬 Выберите расу: </label>
            <select
              id="race-select"
              value={character.race}
              onChange={(e) => handleInputChange("race", e.target.value)}
            >
              <option value="human">Человек</option>
              <option value="elf">Эльф</option>
              <option value="dwarf">Гном</option>
              <option value="orc">Орк</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="class-select">🛡️ Выберите класс: </label>
            <select
              id="class-select"
              value={character.class}
              onChange={(e) => handleInputChange("class", e.target.value)}
            >
              <option value="warrior">Воин</option>
              <option value="mage">Маг</option>
              <option value="rogue">Плут</option>
            </select>
          </div>
        </div>

        {/* Пул доступных очков */}
        <div className="points-pool">
          <h3>Доступные очки: {character.availablePoints}</h3>
        </div>

        {/* Блок распределения характеристик */}
        <div className="stats-container">
          {Object.keys(character.stats).map((stat) => (
            <div key={stat} className="stat-row">
              <span className="stat-label">
                {stat === "strength" && "⚔️ Сила"}
                {stat === "agility" && "🏹 Ловкость"}
                {stat === "intelligence" && "🔮 Интеллект"}
                {stat === "wisdom" && "📜 Мудрость"}
                {` (${character.stats[stat]})`}
              </span>

              <div className="stat-buttons">
                <button onClick={() => changeStat(stat, -1)}>-</button>
                <button onClick={() => changeStat(stat, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* НОВАЯ КНОПКА: Сохранение персонажа */}
        <div className="actions-container" style={{ marginTop: "20px" }}>
          <button
            onClick={handleSave}
            disabled={isFormInvalid}
            className="save-button"
          >
            Сохранить персонажа
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
