import { useState } from "react";
import { initialCharacterState } from "./initialState";
import "./App.css";

function App() {
  const [character, setCharacter] = useState(initialCharacterState);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Изменение характеристик
  const changeStat = (statName, amount) => {
    // Теперь защита стоит прямо на входе в функцию
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

  // Универсальный обработчик полей ввода
  const handleInputChange = (fieldName, value) => {
    setCharacter((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Валидация
  const isNameEmpty = character.name.trim() === "";
  const hasPointsLeft = character.availablePoints > 0;
  const isFormInvalid = isNameEmpty || hasPointsLeft;

  const handleSave = () => {
    if (isFormInvalid) return;
    console.log("Персонаж успешно создан:", character);
    setIsSavedModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSavedModalOpen(false);
    setCharacter(initialCharacterState);
  };

  return (
    <div className="app-container">
      <h1>Генератор Персонажа RPG</h1>

      <div className="creator-card">
        {/* Ввод имени */}
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
          {Object.keys(character.stats).map((stat) => {
            // Заранее вычисляем, заблокированы ли кнопки логически
            const isMinusDisabled = character.stats[stat] <= 10;
            const isPlusDisabled = character.availablePoints === 0;

            return (
              <div key={stat} className="stat-row">
                <span className="stat-label">
                  {stat === "strength" && "⚔️ Сила"}
                  {stat === "agility" && "🏹 Ловкость"}
                  {stat === "intelligence" && "🔮 Интеллект"}
                  {stat === "wisdom" && "📜 Мудрость"}
                  {` (${character.stats[stat]})`}
                </span>

                <div className="stat-buttons">
                  {/* Кнопка минус */}
                  <button
                    onClick={() => changeStat(stat, -1)}
                    style={{
                      opacity: isMinusDisabled ? 0.4 : 1,
                      cursor: isMinusDisabled ? "not-allowed" : "pointer",
                    }}
                    aria-label={`Уменьшить ${stat}`}
                  >
                    -
                  </button>
                  {/* Кнопка плюс */}
                  <button
                    onClick={() => changeStat(stat, 1)}
                    style={{
                      opacity: isPlusDisabled ? 0.4 : 1,
                      cursor: isPlusDisabled ? "not-allowed" : "pointer",
                    }}
                    aria-label={`Увеличить ${stat}`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Блок действий и валидации */}
        <div className="actions-container" style={{ marginTop: "20px" }}>
          <div
            className="validation-status"
            style={{
              color: isFormInvalid ? "#ff6b6b" : "#51cf66",
              marginBottom: "10px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {isFormInvalid
              ? "⚠️ Перед созданием персонажа введите имя и распределите все очки."
              : "✅ Всё заполнено верно! Персонаж готов к созданию."}
          </div>

          <button
            onClick={handleSave}
            disabled={isFormInvalid} // Эту главную кнопку оставляем disabled по ТЗ
            className="save-button"
          >
            Сохранить персонажа
          </button>
        </div>
      </div>

      {/* Модальное окно */}
      {isSavedModalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#2a2a2a",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              textAlign: "center",
              maxWidth: "400px",
              width: "90%",
              border: "1px solid #ffb13b",
            }}
          >
            <h2 style={{ color: "#ffb13b", marginTop: 0 }}>🎉 Герой создан!</h2>
            <p style={{ fontSize: "18px", margin: "20px 0" }}>
              Персонаж <strong>{character.name}</strong> успешно добавлен в вашу
              коллекцию.
            </p>
            <button
              onClick={closeSuccessModal}
              style={{
                backgroundColor: "#ffb13b",
                color: "#000",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Отлично!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
