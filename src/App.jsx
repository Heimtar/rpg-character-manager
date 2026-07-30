import { useState } from 'react';
import { initialCharacterState } from './initialState';
import './App.css';

function App() {
  const [character, setCharacter] = useState(initialCharacterState);

  // Функция для изменения характеристик (принимает имя стата и направление: +1 или -1)
  const changeStat = (statName, amount) => {
    // Защита 1: Если нажимают "+", но свободных очков больше нет — ничего не делаем
    if (amount === 1 && character.availablePoints === 0) return;

    // Защита 2: Если нажимают "-", но характеристика уже на минимуме (10) — ничего не делаем
    if (amount === -1 && character.stats[statName] === 10) return;

    // Обновляем состояние персонажа
    setCharacter((prev) => ({
      ...prev,
      // Уменьшаем или увеличиваем свободные очки на величину amount (1 или -1)
      availablePoints: prev.availablePoints - amount,
      // Обновляем конкретную характеристику внутри вложенного объекта stats
      stats: {
        ...prev.stats,
        // Динамически находим нужный стат по его имени и прибавляем/вычитаем amount
        [statName]: prev.stats[statName] + amount,
      },
    }));
  };

  return (
    <div className="app-container">
      <h1>Генератор Персонажа RPG</h1>

      <div className="creator-card">
        {/* Отображаем пул доступных очков */}
        <div className="points-pool">
          <h3>Доступные очки: {character.availablePoints}</h3>
        </div>

        {/* Блок распределения характеристик */}
        <div className="stats-container">
          {Object.keys(character.stats).map((stat) => (
            <div key={stat} className="stat-row">
              {/* Переводим системные имена характеристик на русский язык */}
              <span className="stat-label">
                {stat === 'strength' && '⚔️ Сила'}
                {stat === 'agility' && '🏹 Ловкость'}
                {stat === 'intelligence' && '🔮 Интеллект'}
                {stat === 'wisdom' && '📜 Мудрость'}
                {` (${character.stats[stat]})`}
              </span>
              
              <div className="stat-buttons">
                {/* Кнопка минус */}
                <button onClick={() => changeStat(stat, -1)}>-</button>
                {/* Кнопка плюс */}
                <button onClick={() => changeStat(stat, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
