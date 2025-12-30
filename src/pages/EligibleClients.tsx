
import React from 'react';
import LegalPageLayout from '../components/layout/LegalPageLayout';

const EligibleClients = () => {
    return (
        <LegalPageLayout title="Допустимые клиенты">
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                    Мы стремимся предоставлять наши образовательные услуги широкому кругу лиц, однако существующие нормы международного права и законодательства отдельных юрисдикций накладывают определенные ограничения.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">Географические ограничения</h2>
                <p>
                    Услуги Платформы не предоставляются резидентам и гражданам следующих стран (включая, но не ограничиваясь):
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>США</li>
                    <li>Канада</li>
                    <li>Северная Корея</li>
                    <li>Иран</li>
                    <li>Сирия</li>
                    <li>Судан</li>
                    <li>Крым (регион)</li>
                </ul>
                <p>
                    Список запрещенных юрисдикций может изменяться в зависимости от обновлений в законодательстве и внутренней политики комплаенса.
                </p>

                <h2 className="text-xl font-bold text-white mt-8 mb-4">Возрастные ограничения</h2>
                <p>
                    Пользователем Платформы может быть только физическое лицо, достигшее 18-летнего возраста (или возраста совершеннолетия в вашей юрисдикции), обладающее полной дееспособностью.
                </p>

                <div className="mt-12 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-sm">
                    Примечание: Данная информация является справочной.
                </div>
            </div>
        </LegalPageLayout>
    );
};

export default EligibleClients;
