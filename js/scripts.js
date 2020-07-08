const createLinearScale = (domainMin, domainMax, rangeMin, rangeMax) => {
  return value => rangeMin + (rangeMax - rangeMin) * ((value - domainMin) / (domainMax - domainMin));
}

const contactsMap = document.querySelector('#contacts-map');

if (contactsMap) {
  ymaps.ready(() => {
    const myMap = new ymaps.Map(contactsMap, {
        center: [59.939335, 30.329618],
        controls: [],
        zoom: 16
      });

    const myPlacemark = new ymaps.Placemark([59.938635, 30.323118], {}, {
        iconLayout: 'default#image',
        iconImageHref: 'img/pin.svg',
        iconImageSize: [80, 140],
        iconImageOffset: [-40, -140]
      });

    myMap.geoObjects.add(myPlacemark);
  });
}

// Slider

const page = document.querySelector('.page');
const sliderControls = document.querySelectorAll('.slider-control');

for (const sliderControl of sliderControls) {
  sliderControl.addEventListener('click', event => {
    event.preventDefault();

    const slide = event.target.dataset.slide;

    document
      .querySelector('.slider-list__item_current')
      .classList
      .remove('slider-list__item_current');

    document
      .querySelector('.slider-list__item[data-slide="' + slide + '"]')
      .classList
      .add('slider-list__item_current');

    document
      .querySelector('.slider-control_current')
      .classList
      .remove('slider-control_current');

    document
      .querySelector('.slider-control[data-slide="' + slide + '"]')
      .classList
      .add('slider-control_current');

    page.dataset.slide = slide;
  });
}

// Feedback

const feedbackWindow = document.querySelector('#feedback-window');
const feedbackButtonOpen = document.querySelector('#feedback-button-open');
const feedbackButtonClose = document.querySelector('#feedback-button-close');

if (feedbackWindow && feedbackButtonOpen) {
  feedbackButtonOpen.addEventListener('click', event => {
    event.preventDefault();

    feedbackWindow.classList.add('window-wrapper_show');
  });
}

if (feedbackWindow && feedbackButtonClose) {
  feedbackButtonClose.addEventListener('click', event => {
    event.preventDefault();

    feedbackWindow.classList.remove('window-wrapper_show');
  });
}

// Range slider

const filterPriceInputMin = document.querySelector('#filter-price-input-min');
const filterPriceInputMax = document.querySelector('#filter-price-input-max');
const filterPriceRangeFill = document.querySelector('#filter-price-range-fill');
const filterPriceRangeMin = document.querySelector('#filter-price-range-min');
const filterPriceRangeMax = document.querySelector('#filter-price-range-max');
const filterPriceStep = 100;

if (filterPriceInputMin && filterPriceRangeMin) {
  filterPriceInputMin.addEventListener('change', event => {
    if (filterPriceRangeMin.value !== event.target.value) {
      filterPriceRangeMin.value = event.target.value;
      filterPriceRangeMin.dispatchEvent(new Event('input'));
    }
  });
}

if (filterPriceInputMax && filterPriceRangeMax) {
  filterPriceInputMax.addEventListener('change', event => {
    if (filterPriceRangeMax.value !== event.target.value) {
      filterPriceRangeMax.value = event.target.value;
      filterPriceRangeMax.dispatchEvent(new Event('input'));
    }
  });
}

if (filterPriceRangeMin) {
  const filterPriceMinScale = createLinearScale(parseFloat(filterPriceRangeMin.min), parseFloat(filterPriceRangeMin.max), 0, filterPriceRangeFill.getClientRects()[0].width);

  if (filterPriceInputMin) {
    filterPriceInputMin.value = filterPriceRangeMin.value;
  }

  const initialLeft = filterPriceMinScale(parseFloat(filterPriceRangeMin.value));
  filterPriceRangeFill.style.paddingLeft = initialLeft + 'px';

  filterPriceRangeMin.addEventListener('input', event => {
    if (filterPriceInputMin && filterPriceInputMin.value !== event.target.value) {
      filterPriceInputMin.value = event.target.value;
    }

    if (filterPriceRangeMax && parseFloat(filterPriceRangeMax.value) < parseFloat(event.target.value) + filterPriceStep) {
      filterPriceRangeMax.value = parseFloat(event.target.value) + filterPriceStep;
      filterPriceRangeMax.dispatchEvent(new Event('input'));
    }

    const left = filterPriceMinScale(parseFloat(event.target.value));

    filterPriceRangeFill.style.paddingLeft = left + 'px';
  });
}

if (filterPriceRangeMax) {
  const filterPriceMaxScale = createLinearScale(parseFloat(filterPriceRangeMax.min), parseFloat(filterPriceRangeMax.max), 0, filterPriceRangeFill.getClientRects()[0].width);

  if (filterPriceInputMax) {
    filterPriceInputMax.value = filterPriceRangeMax.value;
  }

  const initialRight = filterPriceRangeFill.getClientRects()[0].width - filterPriceMaxScale(parseFloat(filterPriceRangeMax.value));
  filterPriceRangeFill.style.paddingRight = initialRight + 'px';

  filterPriceRangeMax.addEventListener('input', event => {
    if (filterPriceInputMax && filterPriceInputMax.value !== event.target.value) {
      filterPriceInputMax.value = event.target.value;
    }

    if (filterPriceRangeMin && parseFloat(filterPriceRangeMin.value) > parseFloat(event.target.value) - filterPriceStep) {
      filterPriceRangeMin.value = parseFloat(event.target.value) - filterPriceStep;
      filterPriceRangeMin.dispatchEvent(new Event('input'));
    }

    const right = filterPriceRangeFill.getClientRects()[0].width - filterPriceMaxScale(parseFloat(event.target.value));

    filterPriceRangeFill.style.paddingRight = right + 'px';
  });
}
