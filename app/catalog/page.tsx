"use client"
import ReviewsSlider from '@/components/Slider';
import ProductCatalog from '@/components/CatalogCard';
import { useState } from 'react';
import OrderModal from '@/components/OrderModal';
import Link from 'next/link';

export default function CatalogPage() {
  const [isPreorderOpen, setIsPreorderOpen] = useState(false);

  return (
    <>
      <h1 className="page-title">Каталог</h1>
      <hr />

      <h3>Прайс лист для:</h3>
      <Link className='photosWithOrangeMan' href='/catalogForIndividual'> <h1> Физических Лиц </h1></Link>
      <Link className='photosWithOrangeMan' href='/catalogForLegalEntity'><h1> Юридических Лиц</h1></Link>
      <hr />
      <a className='photosWithOrangeMan' href="/doc/services/publicOffer.docx"><h4>Публичная оферта </h4></a>
      <a className='photosWithOrangeMan' href="/doc/services/retail_2026.xlsx"><h4> Прейскуринт</h4></a>
      <p>Одновременно со сбытом электрической энергии Омская энергосбытовая компания развивает коммерческие услуги в области энергоснабжения и иных видов сервиса. Задачи клиентов выполняются «под ключ», начиная с замены счётчиков электроэнергии, заканчивая монтажом сложного электрооборудования.</p>
      <p>Все клиентские офисы компании осуществляют продажу электротехнической продукции и принимают заявки от граждан и предприятий на выполнение бытовых электромонтажных работ, электромонтажных работ в сетях 0,4-10 кВ, клининговых услуг и многих других видов сервиса.</p>
      <p>Вы можете оформить заказ на электротехническую продукцию на нашем сайте или в любом из наших филиалов. ООО «ОЭК» предлагает широкий ассортимент современного электротехнического оборудования и изделий для электромонтажа.

        Вся поставляемая продукция – это сертифицированное оборудование от ведущих производителей. ООО «ОЭК» предлагает качественную электротехническую продукцию, ведь это важный элемент надёжной и безопасной работы.</p>
      <p>Оплатить услугу возможно в кассе компании, на сайте<a href='https://www.omesc.ru/'> www.omesc.ru</a> либо через Сбербанк.</p>
      <button className="btn" onClick={() => setIsPreorderOpen(true)}>
        Открыть предзаказ
      </button>
      <h3>Популярные товары:</h3>
      <section>
        <ProductCatalog />
      </section>

      <section>
        <h3>Отзывы наших клиентов</h3>
        <ReviewsSlider />
      </section>

      <OrderModal isOpen={isPreorderOpen} onClose={() => setIsPreorderOpen(false)} />
    </>
  );
}