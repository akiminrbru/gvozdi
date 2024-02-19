const getItem = async () => {
    let data;
    await fetch('https://gvozditut.ru/api/stores/').then(response => response.json()).then(res => {
        data = res;
    });
    
    let store__list = document.querySelector('.store__list');
    if (data && store__list) {
        data.items.map((item) => {
            store__list.innerHTML += `<div class="store__item">
            <a href="${item.url}" class="store__item_title">${item.title}</a>
            <div class="store__item_time">
                <img src="assets/icons/clock.svg" alt="clock">
                <p>${item.time}</p>
            </div>
            <div class="store__item_image">
                <img src=${item.image["1x"]} alt="store">
            </div>
            <div class="store__item_mail">
                <img src="assets/icons/mail-mini.svg" alt="mail">
                <a href="mailto:${item.email}">${item.email}</a>
            </div>
            <div class="store__item_place">
                <img src="assets/icons/place.svg" alt="place">
                <p>${item.address}</p>
            </div>
            <div class="store__item_phone">
                <img src="assets/icons/phone-mini.svg" alt="phone">
                <a href="tel:${item.phone ? item.phone : "+73452538137"}">${item.phone ? item.phone : "+73452538137"}</a>
            </div></div>`
        }); 
    };

    let myMap;

    // Дождёмся загрузки API и готовности DOM.
    ymaps.ready(init);

    function init () {
        // Создание экземпляра карты и его привязка к контейнеру с
        // заданным id ("map").
        myMap = new ymaps.Map('map', {
            // При инициализации карты обязательно нужно указать
            // её центр и коэффициент масштабирования.
            center: [57.191918, 65.552159],
            zoom: 11,
            controls: []
        }, {
            searchControlProvider: 'yandex#search',
            suppressMapOpenBlock: true
        });

        BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="balloon-root ">'+
                '<a class="close" href="#"><img src="assets/icons/close.svg" alt="close"></a>'+
                '<div class="arrow balloon-pin"></div>'+
                '<div class="balloon-head balloon">$[properties.balloonHeader]<p class="balloon-desc balloon">Магазин</p></div>'+
                '<div class="balloon-body balloon">$[properties.balloonContent]</div>'+
            '</div>', {
            //Формирование макета
            build: function () {
                this.constructor.superclass.build.call(this);
                this._$element = $('.balloon-root', this.getParentElement());
                this.applyElementOffset();
                this._$element.find('.close')
                    .on('click', $.proxy(this.onCloseClick, this));
            },
            //удаление макета из DOM
            clear: function () {
                this._$element.find('.close')
                    .off('click');
                this.constructor.superclass.clear.call(this);
            },
            //закрытие балуна
            onCloseClick: function (e) {
                e.preventDefault();
                this.events.fire('userclose');
            },
            
            //Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
            applyElementOffset: function () {
                this._$element.css({
                    left: -(this._$element[0].offsetWidth / 2),
                    top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                });
            },
            
        });

        let marks;

        if (data) {
            marks = data.items.map((item) => 
                new ymaps.Placemark([item.lon, item.lat], {
                    hintContent: `${item.title}`,
                    balloonHeader: `${item.title}`,
                    balloonContent: `<ul><li><img src="assets/icons/phone-gray.svg" alt="icon"><a href="tel:${item.phone ? item.phone : "+73452538137"}">${item.phone ? item.phone : "+7 (3452) 53-81-37"}</a></li><li><img src="assets/icons/mail-gray.svg" alt="icon"><a href="mailto:item.email">${item.email}</a></li><li><img src="assets/icons/time-gray.svg" alt="icon"><p>${item.time}</p></li></ul><div class="balloon-img"><img src="${item.image["1x"]}" alt="Фото"></div>`,
                }, {
                    balloonShadow: true,
                    balloonLayout: BalloonContentLayout,
                    balloonPanelMaxMapArea: 1,
                    // Опции.
                    // Необходимо указать данный тип макета.
                    iconLayout: 'default#image',
                    // Своё изображение иконки метки.
                    iconImageHref: 'assets/icons/marker.svg',
                    // Размеры метки.
                    iconImageSize: [40, 48],
                    // Смещение левого верхнего угла иконки относительно
                    // её "ножки" (точки привязки).
                    iconImageOffset: [-5, -38],
                })
            )
        }

        marks?.forEach(element => {
            myMap.geoObjects.add(element)
        });
    }

}

getItem();
