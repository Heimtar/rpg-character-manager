import { useState } from 'react';
import { initialCharacterState } from './initialState';
import './App.css';

function App() {
  const [character, setCharacter] = useState(initialCharacterState);
  // Новый стейт для управления показом окошка об успешном сохранении
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

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

  // Универсальный обработчик полей ввода
  const handleInputChange = (fieldName, value) => {
    setCharacter((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Проверки для валидации (разбили на отдельные переменные для точности подсказок)
  const isNameEmpty = character.name.trim() === '';
  const hasPointsLeft = character.availablePoints > 0;
  const isFormInvalid = isNameEmpty || hasPointsLeft;

  // Функция сохранения (без алертов)
  const handleSave = () => {
    if (isFormInvalid) return;
    console.log('Персонаж успешно создан:', character);
    setIsSavedModalOpen(true); // Открываем кастомное окошко успеха
  };

  // Функция для сброса формы и закрытия окошка успеха
  const closeSuccessModal = () => {
    setIsSavedModalOpen(false);
    setCharacter(initialCharacterState); // Сбрасываем форму для нового героя
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
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        {/* Выбор Расы и Класса */}
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

        {/* Блок действий и валидации */}
        <div className="actions-container" style={{ marginTop: '20px' }}>
          {/* НОВАЯ ПОДСКАЗКА: Показывается только если форма не готова */}
          {isFormInvalid && (
            <div className="validation-warning" style={{ color: '#ff6b6b', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              ⚠️ Перед созданием персонажа введите имя и распределите все очки.
            </div>
          )}

          <button 
            onClick={handleSave} 
            disabled={isFormInvalid}
            className="save-button"
          >
            Сохранить персонажа
          </button>
        </div>
      </div>

      {/* НОВОЕ ОКОШКО (Модальное окно успешного сохранения) */}
      {isSavedModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            textAlign: 'center', maxWidth: '400px', width: '90%', border: '1px solid #ffb13b'
          }}>
            <h2 style={{ color: '#ffb13b', marginTop: 0 }}>🎉 Герой создан!</h2>
            <p style={{ fontSize: '18px', margin: '20px 0' }}>
              Персонаж <strong>{character.name}</strong> успешно добавлен в вашу коллекцию.
            </p>
            <button 
              onClick={closeSuccessModal}
              style={{
                backgroundColor: '#ffb13b', color: '#000', border: 'none', padding: '10px 20px',
                borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
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
