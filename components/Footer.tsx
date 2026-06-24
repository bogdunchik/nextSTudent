import Link from 'next/link';

export default function Footer() {
    return (
        <div className=''>
            <footer className="footer">
                <div className="footer-content">
                    <ul className='footer-column'>
                        <li className='footer-links '>Общество с ограниченной ответственностью «Омская энергосбытовая компания»
                            Почтовый адрес: 644042, г. Омск, ул. Карла Маркса 41/15.
                            Контакт-центр:
                            8 (3812) 79-00-10</li>
                    </ul>
                    <ul className='footer-column'>
                        <li className='footer-links '>Данный сайт является студенческим проектом. Информация о недоступности сайта
                            Условия соглашения
                            Карта сайта</li>
                    </ul>
                    <ul className='footer-column'>
                        <li className='footer-links '>Омская энергосбытовая компания
                            © 2026. Все права защищены</li></ul>
                    <nav className="footer-links">
                        <a href="/">Главная </a>
                        <a href="/about">О нас</a>
                        <a href="/catalog">Каталог</a>
                        <a href="/contacts">Контакты</a>
                    </nav>
                </div>
            </footer ></div>
    );
}
