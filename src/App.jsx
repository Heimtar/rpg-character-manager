import { useState } from 'react';
import { initialCharacterState } from './initialState';
import './App.css';

function App() {
  const [character, setCharacter] = useState(initialCharacterState);

  // Функция для изменения характеристик (осталась прежней)
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

  // Новая функция для обработки изменений в простых полях (Раса, Класс)
  const handleInputChange = (fieldName, value) => {
    setCharacter((prev) => ({
      ...prev,
      [fieldName]: value, // динамически меняем либо 'race', либо 'class'
    }));
  };

  return (
    <div className="app-container">
      <h1>Генератор Персонажа RPG</h1>

      <div className="creator-card">
        
        {/* НОВЫЙ БЛОК: Выбор Расы и Класса */}
        <div className="dropdowns-container">
          <div className="form-group">
            <label htmlFor="race-select">🧬 Выберите расу: </label>
            <select 
              id="race-select"
              value={character.race}
              onChange={(e) => handleInputChange('race', e.target.value)}
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
              onChange={(e) => handleInputChange('class', e.target.value)}
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
                {stat === 'strength' && '⚔️ Сила'}
                {stat === 'agility' && '🏹 Ловкость'}
                {stat === 'intelligence' && '🔮 Интеллект'}
                {stat === 'wisdom' && '📜 Мудрость'}
                {` (${character.stats[stat]})`}
              </span>
              
              <div className="stat-buttons">
                <button onClick={() => changeStat(stat, -1)}>-</button>
                <button onClick={() => changeStat(stat, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Временный дебаг-блок, чтобы видеть, что стейт меняется */}
        <div className="debug-preview" style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
          Выбрано в стейте: Раса — {character.race}, Класс — {character.class}
        </div>

      </div>
    </div>
  );
}

export default App;
