import React, { useEffect, useState } from 'react';
import './Main.css'
const dataURL = 'https://dpg.gg/test/calendar.json';

export const Main = () => {
    const [contributions, setContributions] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [showColorInfoPopup, setShowColorInfoPopup] = useState(null);


    // Загрузка данных при монтировании компонента.
    const fetchData = async () => {
        try {
            const response = await fetch(dataURL);
            const jsonData = await response.json();
            setContributions(jsonData);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 
    const getLast357Days = () => {
        const today = new Date();
        const last357Days = [];
        for (let i = 0; i < 357; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last357Days.push(date.toISOString().split('T')[0]);
        }
        return last357Days.reverse();
    };


    // Получение названия месяца по его числовому представлению.
    const getMonthLabels = () => {
        const uniqueMonths = Array.from(new Set(contributionData.flatMap((week) => week.map((item) => item.date.slice(0, 7)))));
        return uniqueMonths.map((month) => (
            <div key={month} className="month-label">
                {getMonthName(month.slice(5, 7))}
            </div>
        ));
    };
    const getMonthName = (monthNum) => {
        const monthNames = [
            'Янв.', 'Февр.', 'Март', 'Апр.', 'Май', 'Июнь',
            'Июль', 'Авг.', 'Сент.', 'Окт.', 'Нояб.', 'Дек.'
        ];
        return monthNames[parseInt(monthNum, 10) - 1];
    };

    // Рассчет данных для отображения контрибуций
    const generateContributionData = () => {
        const last357Days = getLast357Days();
        const contributionData = [];
        let week = [];
        for (let i = 0; i < 357; i++) {
            const date = last357Days[i];
            const contributionCount = contributions[date] || 0;
            week.push({ date, count: contributionCount });
            if ((i + 1) % 7 === 0) {
                contributionData.push(week);
                week = [];
            }
        }
        return contributionData;
    };

    // Определение цвета блока в зависимости от количества контрибуций
    const getBlockColor = (count) => {
        if (count === 0) return '#EDEDED';
        else if (count >= 1 && count <= 9) return '#ACD5F2';
        else if (count >= 10 && count <= 19) return '#7FA8C9';
        else if (count >= 20 && count <= 29) return '#527BA0';
        else return '#254E77';
    };

    const contributionData = generateContributionData();

    // Всплывающее окно с информацией контрибуций

    const renderInfoPopup = () => {
        if (selectedCell) {
            const { count, date } = selectedCell;
            const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });

            return (
                <div className="info-popup">
                    <p>{count} contributions</p>
                    <p>{formattedDate}</p>
                </div>
            );
        }
        return null;
    };

    // Всплывающее окно определющие колличество контрибуций по цветам
    const colorBoxesData = [
        { color: '#EDEDED', description: 'нет контрибуций' },
        { color: '#ACD5F2', description: '1-9 контрибуций' },
        { color: '#7FA8C9', description: '10-19 контрибуций' },
        { color: '#527BA0', description: '20-29 контрибуций' },
        { color: '#254E77', description: '30+ контрибуций' },
    ];

    const renderColorInfoPopup = (boxData) => {
        return (
            <div className="color-info-popup">
                {boxData.description}
            </div>
        );
    };

    return (
        <div className="contribution-graph">
            <div className='contribution-content'>
                <div className='contribution-container'>
                    <div className="weekday-labels">
                        <div className="weekday-label">Пн</div>
                        <div className="weekday-label"></div>
                        <div className="weekday-label">Ср</div>
                        <div className="weekday-label"></div>
                        <div className="weekday-label">Пт</div>
                        <div className="weekday-label"></div>
                        <div className="weekday-label"></div>
                    </div>
                    <div>
                        <div className="month-labels">
                            {getMonthLabels()}
                        </div>
                        <div className="contribution-grid">
                            {contributionData.map((week, weekIndex) => (
                                <div key={weekIndex} className="week-row">
                                    {week.map((item, dayIndex) => (
                                        <div
                                            key={item.date}
                                            className="contribution-block"
                                            style={{ backgroundColor: getBlockColor(item.count) }}
                                            title={`Дата: ${item.date}, Контрибуции: ${item.count}`}
                                            onClick={() => setSelectedCell({ ...item, week: weekIndex, day: dayIndex })}
                                            onMouseLeave={() => setSelectedCell(null)}
                                        >  {selectedCell && selectedCell.date === item.date && renderInfoPopup()}</div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="contribution-color-info">
                            <span>Меньше</span>
                            <div className="contribution-color-boxs">
                                {colorBoxesData.map((boxData, index) => (
                                    <div
                                        key={index}
                                        className={`color-box${index + 1} box`}
                                        style={{ backgroundColor: boxData.color }}
                                        onClick={(e) => setShowColorInfoPopup(showColorInfoPopup === index ? null : index)}
                                        onMouseLeave={() => setShowColorInfoPopup(null)}
                                    >{showColorInfoPopup === index && renderColorInfoPopup(colorBoxesData[showColorInfoPopup])}</div>
                                ))}
                            </div>
                            <span>Больше</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Main;



