export default function ContactsPage() {
  return (
    <>
      <div className="contacts-grid">
        <div>
          <h1 className="page-title">Контакты</h1>
          <hr />
          <h3>По вопросам, связанным со снабжением электрической энергией (мощности), можно обратиться:</h3>
          <div itemScope itemType="http://schema.org/LocalBusiness">
            <div itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
              <b> Почтовый адрес</b>:{" "}
              <span itemProp="postalCode">644042</span>,{" "}
              <span itemProp="addressLocality">г. Омск</span>,{" "}
              <span itemProp="streetAddress">ул. Карла Маркса 41/15</span>
            </div>
            <div><b>Контакт-центр</b>: <span itemProp="telephone">8 (3812) 79-00-10</span></div>
            <p>Консультации оказываются в рабочие дни с понедельника по пятницу с 8-00 до 20-00</p>
            <p>в субботу с 10-00 до 15-00. Выходной: воскресенье</p>
            <p><b>E-mail:</b></p>
          </div>
          <p>По расчётам населения <a href="mailto:info_fl@omesc.ru">info_fl@omesc.ru</a></p>
          <p>По расчётам юридических лиц, индивидуальных предпринимателей и физических лиц – небытовых потребителей
            <a href="mailto:info_ul@omesc.ru"> info_ul@omesc.ru</a></p>
          <p>Приёмная - <a href="mailto:info@omesc.ru"> info@omesc.ru</a></p>
          <i>*В настоящий момент невозможно принятие обращений от зарубежных почтовых серверов/сервисов, таких как Gmail.com, Outlook.com, iCloud.com, Yahoo.com и т.п.</i>
        </div>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2290.8603214739674!2d73.38478197727062!3d54.958010572800355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x43aafdf1540980d1%3A0x945c54672bdafbd3!2z0J7QvNGB0LrQsNGPINGN0L3QtdGA0LPQvtGB0LHRi9GC0L7QstCw0Y8g0LrQvtC80L_QsNC90LjRjw!5e0!3m2!1sru!2sru!4v1781556826988!5m2!1sru!2sru"
          width="400" height="400" loading="lazy" ></iframe>
      </div>
    </>
  );
}
