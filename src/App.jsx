import { useState, useEffect } from "react";
// Импортируем массивы для рандома
import {
  initialCharacterState,
  RANDOM_NAMES,
  RANDOM_RACES,
  RANDOM_CLASSES,
  initialLibraryState,
} from "./initialState";
import "./App.css";

function App() {
  const [character, setCharacter] = useState(initialCharacterState);
  const [library, setLibrary] = useState(() => {
    const savedLibrary = localStorage.getItem("rpg_character_library");
    // Если в хранилище что-то есть, превращаем строку обратно в массив.
    // Если там пусто, берем дефолтный initialLibraryState
    return savedLibrary ? JSON.parse(savedLibrary) : initialLibraryState;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Изменение характеристик
  useEffect(() => {
    // Превращаем массив библиотеки в строку и бережно сохраняем в браузер
    localStorage.setItem("rpg_character_library", JSON.stringify(library));
  }, [library]); // Массив зависимостей: хук будет срабатывать каждый раз, когда меняется library
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

  // Обработчик полей ввода (без изменений)
  const handleInputChange = (fieldName, value) => {
    setCharacter((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // 🔥 НОВАЯ ФУНКЦИЯ: Случайная генерация персонажа
  const generateRandomCharacter = () => {
    // 1. Выбираем случайное имя, расу и класс из массивов
    const randomName =
      RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    const randomRace =
      RANDOM_RACES[Math.floor(Math.random() * RANDOM_RACES.length)];
    const randomClass =
      RANDOM_CLASSES[Math.floor(Math.random() * RANDOM_CLASSES.length)];

    // 2. Алгоритм случайного распределения 20 очков
    const statsKeys = ["strength", "agility", "intelligence", "wisdom"];
    // Начинаем с базовых 10 очков для каждого стата
    const randomStats = {
      strength: 10,
      agility: 10,
      intelligence: 10,
      wisdom: 10,
    };

    // В цикле 20 раз кидаем "кубик" и добавляем по 1 очку в случайную характеристику
    for (let i = 0; i < 20; i++) {
      const randomStatName =
        statsKeys[Math.floor(Math.random() * statsKeys.length)];
      randomStats[randomStatName] += 1;
    }

    // 3. Записываем всё в стейт одним махом
    setCharacter({
      name: randomName,
      race: randomRace,
      class: randomClass,
      stats: randomStats,
      availablePoints: 0, // Все очки распределены!
    });
  };

  // Валидация (без изменений)
  const isNameEmpty = character.name.trim() === "";
  const hasPointsLeft = character.availablePoints > 0;
  const isFormInvalid = isNameEmpty || hasPointsLeft;
  const filteredLibrary = library.filter((hero) =>
    hero.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleSave = () => {
    if (isFormInvalid) return;

    const newCharacter = {
      ...character,
      id: crypto.randomUUID(), // встроенный в браузер генератор ID
      createdAt: new Date().toLocaleDateString(),
    };

    setLibrary((prevLibrary) => [newCharacter, ...prevLibrary]);
    setIsSavedModalOpen(true);
  };
  const deleteCharacter = (id) => {
    setLibrary((prevLibrary) => prevLibrary.filter((char) => char.id !== id));
  };
  const translate = (key) => {
    const dictionary = {
      human: "Человек",
      elf: "Эльф",
      dwarf: "Гном",
      orc: "Орк",
      warrior: "Воин",
      mage: "Маг",
      rogue: "Плут",
    };
    return dictionary[key] || key;
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
        <div
          className="actions-container"
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            className="validation-status"
            style={{
              color: isFormInvalid ? "#ff6b6b" : "#51cf66",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {isFormInvalid
              ? "⚠️ Перед созданием персонажа введите имя и распределите все очки."
              : "✅ Всё заполнено верно! Персонаж готов к созданию."}
          </div>

          {/* 🔥 НОВАЯ КНОПКА: Рандомайзер */}
          <button
            onClick={generateRandomCharacter}
            className="random-button"
            style={{
              backgroundColor: "#4dabf7",
              color: "#fff",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🎲 Случайная генерация
          </button>

          <button
            onClick={handleSave}
            disabled={isFormInvalid}
            className="save-button"
          >
            Сохранить персонажа
          </button>
        </div>
      </div>
      <div className="library-section" style={{ marginTop: "40px" }}>
        <h2>📚 Библиотека персонажей ({library.length})</h2>
        <div className="search-container" style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="🔍 Поиск героя по имени..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #444",
              backgroundColor: "#1a1a1a",
              color: "#fff",
            }}
          />
        </div>

        {filteredLibrary.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center" }}>
            Библиотека пуста. Создайте своего первого героя!
          </p>
        ) : (
          <div
            className="library-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {filteredLibrary.map((hero) => (
              <div
                key={hero.id}
                className="character-card"
                style={{
                  backgroundColor: "#2a2a2a",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid #444",
                  position: "relative",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", color: "#ffb13b" }}>
                  {hero.name}
                </h3>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>Раса:</strong> {translate(hero.race)}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>Класс:</strong> {translate(hero.class)}
                </p>

                <div
                  className="hero-stats-preview"
                  style={{
                    marginTop: "10px",
                    background: "#1a1a1a",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "13px",
                  }}
                >
                  <div>⚔️ Сил: {hero.stats.strength}</div>
                  <div>🏹 Лов: {hero.stats.agility}</div>
                  <div>🔮 Инт: {hero.stats.intelligence}</div>
                  <div>📜 Муд: {hero.stats.wisdom}</div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "15px",
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#666" }}>
                    {hero.createdAt}
                  </span>
                  <button
                    onClick={() => deleteCharacter(hero.id)}
                    style={{
                      backgroundColor: "#ff6b6b",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    🗑️ Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно (без изменений) */}
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
