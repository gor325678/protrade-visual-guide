
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const TradingReport = () => {
    const { t } = useLanguage();

    return (
        <>
            <style>
                {`
          /* --- СТИЛИ КОНТЕЙНЕРА --- */
          .ptr-container {
              font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #111827; /* Глубокий темный фон */
              color: #e5e7eb; /* Светло-серый текст */
              padding: 24px;
              border-radius: 16px;
              max-width: 900px;
              margin: 30px auto 0;
              box-shadow: 0 20px 50px rgba(0,0,0,0.6);
              border: 1px solid #374151;
          }

          /* --- ЗАГОЛОВОК --- */
          .ptr-header {
              text-align: center;
              margin-bottom: 30px;
          }
          .ptr-header h2 {
              margin: 0;
              font-size: 26px;
              background: linear-gradient(90deg, #fff, #9ca3af);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
          }
          .ptr-header p { margin: 5px 0 0; color: #6b7280; font-size: 14px; }

          /* --- СЕТКА ПОКАЗАТЕЛЕЙ (GRID) --- */
          .ptr-stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
              gap: 12px;
              margin-bottom: 30px;
          }

          .ptr-stat-card {
              background-color: #1f2937;
              padding: 15px;
              border-radius: 10px;
              text-align: center;
              border: 1px solid #374151;
              transition: transform 0.2s;
          }
          .ptr-stat-card:hover { transform: translateY(-2px); border-color: #4b5563; }

          .ptr-stat-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
          .ptr-stat-value { font-size: 20px; font-weight: 800; color: #f3f4f6; }
          
          .text-green { color: #10b981; }
          .text-gold { color: #fbbf24; }
          .text-red { color: #ef4444; }

          /* --- ГРАФИК (МАГИЯ DARK MODE) --- */
          .ptr-chart-box {
              margin-bottom: 30px;
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid #374151;
              position: relative;
              background: #000; /* Фон подложки */
              min-height: 200px; /* Placeholder height */
              display: flex;
              align-items: center;
              justify-content: center;
          }

          .ptr-chart-img {
              width: 100%;
              height: auto;
              display: block;
              /* ФИЛЬТР: Инвертирует цвета (белый фон -> черный, синяя линия -> золотая) */
              filter: invert(1) hue-rotate(180deg) contrast(1.2); 
              mix-blend-mode: screen; /* Убирает остаточный фон */
          }

          /* --- ТАБЛИЦА (SCROLLABLE) --- */
          .ptr-table-wrapper {
              overflow-x: auto;
              border-radius: 10px;
              border: 1px solid #374151;
              background: #1f2937;
          }

          .ptr-table { width: 100%; border-collapse: collapse; font-size: 14px; white-space: nowrap; }
          .ptr-table th { background-color: #374151; color: #d1d5db; padding: 14px 18px; text-align: left; font-size: 12px; text-transform: uppercase; }
          .ptr-table td { padding: 12px 18px; border-bottom: 1px solid #374151; color: #e5e7eb; }
          .ptr-table tr:last-child td { border-bottom: none; }
          
          /* Бейджи типов сделок */
          .ptr-badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
          .badge-buy { background-color: rgba(16, 185, 129, 0.15); color: #34d399; }
          .badge-sell { background-color: rgba(239, 68, 68, 0.15); color: #f87171; }
          .badge-deposit { background-color: rgba(59, 130, 246, 0.15); color: #60a5fa; }

          /* Footer */
          .ptr-footer { margin-top: 15px; text-align: center; font-size: 12px; color: #4b5563; }
        `}
            </style>

            <div className="ptr-container">
                <div className="ptr-header">
                    <h2>{t('report.title')}</h2>
                    <p>{t('report.subtitle')}</p>
                </div>

                <div className="ptr-stats-grid">
                    <div className="ptr-stat-card">
                        <div className="ptr-stat-label">{t('report.net_profit')}</div>
                        <div className="ptr-stat-value text-green">$396.93</div>
                    </div>
                    <div className="ptr-stat-card">
                        <div className="ptr-stat-label">{t('report.total_gain')}</div>
                        <div className="ptr-stat-value text-green">+396%</div>
                    </div>
                    <div className="ptr-stat-card">
                        <div className="ptr-stat-label">{t('report.profit_factor')}</div>
                        <div className="ptr-stat-value text-gold">2.94</div>
                    </div>
                    <div className="ptr-stat-card">
                        <div className="ptr-stat-label">{t('report.win_rate')}</div>
                        <div className="ptr-stat-value">76.6%</div>
                    </div>
                </div>

                <div className="ptr-chart-box">
                    <img src="/trading_report_chart.png" alt="Growth Chart" className="ptr-chart-img" />
                </div>

                <h3 style={{ margin: '0 0 15px 5px', fontSize: '16px', color: '#d1d5db' }}>{t('report.log')}</h3>
                <div className="ptr-table-wrapper">
                    <table className="ptr-table">
                        <thead>
                            <tr>
                                <th>{t('report.table.time')}</th>
                                <th>{t('report.table.type')}</th>
                                <th>{t('report.table.size')}</th>
                                <th>{t('report.table.symbol')}</th>
                                <th>{t('report.table.price')}</th>
                                <th>{t('report.table.profit')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ color: '#9ca3af' }}>2025.05.19</td>
                                <td><span className="ptr-badge badge-deposit">DEPOSIT</span></td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td className="text-green"><b>$100.00</b></td>
                            </tr>
                            <tr>
                                <td>2025.05.19</td>
                                <td><span className="ptr-badge badge-buy">buy</span></td>
                                <td>0.01</td>
                                <td>gbpjpy</td>
                                <td>193.341</td>
                                <td className="text-green">+2.44</td>
                            </tr>
                            <tr>
                                <td>2025.05.20</td>
                                <td><span className="ptr-badge badge-sell">sell</span></td>
                                <td>0.01</td>
                                <td>gbpjpy</td>
                                <td>193.233</td>
                                <td className="text-red">-1.78</td>
                            </tr>
                            <tr>
                                <td>2025.05.22</td>
                                <td><span className="ptr-badge badge-buy">buy</span></td>
                                <td>0.03</td>
                                <td>gbpjpy</td>
                                <td>192.721</td>
                                <td className="text-green">+10.61</td>
                            </tr>

                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#6b7280', fontStyle: 'italic' }}>
                                    &darr; ... {t('report.phase')} ... &darr;
                                </td>
                            </tr>

                            <tr>
                                <td>2025.06.25</td>
                                <td><span className="ptr-badge badge-buy">buy</span></td>
                                <td>0.05</td>
                                <td>gbpjpy</td>
                                <td>198.138</td>
                                <td className="text-green">+12.52</td>
                            </tr>
                            <tr>
                                <td>2025.06.26</td>
                                <td><span className="ptr-badge badge-buy">buy</span></td>
                                <td>0.05</td>
                                <td>gbpjpy</td>
                                <td>197.956</td>
                                <td className="text-green">+16.30</td>
                            </tr>
                            <tr>
                                <td>2025.06.27</td>
                                <td><span className="ptr-badge badge-buy">buy</span></td>
                                <td>0.05</td>
                                <td>gbpjpy</td>
                                <td>198.502</td>
                                <td className="text-green">+2.87</td>
                            </tr>

                            <tr style={{ backgroundColor: '#374151' }}>
                                <td colSpan={5} style={{ textAlign: 'right', fontWeight: 'bold', color: '#fff' }}>{t('report.total_net_profit')}</td>
                                <td className="text-green" style={{ fontWeight: 'bold', fontSize: '16px' }}>$396.93</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="ptr-footer">
                    {t('report.verified')} &bull; RoboForex Ltd &bull; 2025
                </div>
            </div>
        </>
    );
};

export default TradingReport;
