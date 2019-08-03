"use strict";
const location_name = document.getElementById('location');
const temperature = document.getElementById('temperature');
const temperature_desc = document.getElementById('temperature-description');
const weather_info = document.querySelector('.weather-info');
const main_icon = document.getElementById("main-icon");
const main_panel = document.querySelector('.main-panel');
const day_1_content = document.getElementById('day-1-content');
const day_2_content = document.getElementById('day-2-content');
const day_3_content = document.getElementById('day-3-content');
const day_4_content = document.getElementById('day-4-content');
const day_1_weekday = document.getElementById("day-1-weekday");
const day_2_weekday = document.getElementById("day-2-weekday");
const day_3_weekday = document.getElementById("day-3-weekday");
const day_4_weekday = document.getElementById("day-4-weekday");
const day_1_temp = document.getElementById('day-1-temp');
const day_2_temp = document.getElementById('day-2-temp');
const day_3_temp = document.getElementById('day-3-temp');
const day_4_temp = document.getElementById('day-4-temp');
const day_1_icon = document.getElementById('day-1-icon');
const day_2_icon = document.getElementById('day-2-icon');
const day_3_icon = document.getElementById('day-3-icon');
const day_4_icon = document.getElementById('day-4-icon');
const forecast = document.querySelector('.forecast');
const forecast_card = document.querySelector('.forecast-card');
const burger_icon = document.querySelector('.burger-icon');
const burger_panel = document.querySelector('.burger-panel');
const save_btn = document.getElementById('apply-btn');
const cancel_btn = document.getElementById('cancel-btn');
const light_theme_option = document.getElementById('light-theme-option');
const dark_theme_option = document.getElementById('dark-theme-option');
const celsius_option = document.getElementById('celsius-option');
const fahrenheit_option = document.getElementById('fahrenheit-option');
const current_theme = localStorage.getItem('theme');
const current_unit = localStorage.getItem('unit');
const preloader = document.getElementById('preloader');
const default_language = 'en';
let language;
let temp_unit;
let theme;
loadSettings();

window.addEventListener("load", () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                language =
                    (navigator.languages && navigator.languages[0]) ||
                    navigator.language ||
                    navigator.userLanguage;

                language = shortenLangCode(language);

                // api calls
                const temp_u1 = temp_unit == 'celsius' ? 'metric' : 'imperial';
                const weather = `weather/${lat},${lon},${language},${temp_u}`;
                const forecast = `forecast/${lat},${lon},${language},${temp_u}`;
                const response_weather = await fetch(weather);
                const response_forecast = await fetch(forecast);
                const data_weather = await response_weather.json();
                const data_forecast = await response_forecast.json();
                const cod_status = data_weather.cod || data_forecast.cod; // openweathermap api status code
                const cod_status_msg = data_weather.message || data_forecast.message; // status message

                if (cod_status == 200) {
                    init();

                    // current weather
                    const { name } = data_weather;
                    const { temp } = data_weather.main;
                    const { description } = data_weather.weather[0];
                    const { id } = data_weather.weather[0];
                    let { sunset } = data_weather.sys;
                    let { sunrise } = data_weather.sys;

                    // 4 day forecast
                    const filteredData = filterData(data_forecast);
                    const { temp: day1_temp } = filteredData[0].main;
                    const { temp: day2_temp } = filteredData[1].main;
                    const { temp: day3_temp } = filteredData[2].main;
                    const { temp: day4_temp } = filteredData[3].main;
                    const { id: day1_iconID } = filteredData[0].weather[0];
                    const { id: day2_iconID } = filteredData[1].weather[0];
                    const { id: day3_iconID } = filteredData[2].weather[0];
                    const { id: day4_iconID } = filteredData[3].weather[0];

                    document.title = 'Weather in ' + name;
                    location_name.textContent = name;
                    temperature.textContent = Math.round(temp);
                    temperature_desc.textContent = description;
                    day_1_temp.textContent = Math.round(day1_temp);
                    day_2_temp.textContent = Math.round(day2_temp);
                    day_3_temp.textContent = Math.round(day3_temp);
                    day_4_temp.textContent = Math.round(day4_temp);
                    setIcon(getMainIcon(day1_iconID, null, null), day_1_icon);
                    setIcon(getMainIcon(day2_iconID, null, null), day_2_icon);
                    setIcon(getMainIcon(day3_iconID, null, null), day_3_icon);
                    setIcon(getMainIcon(day4_iconID, null, null), day_4_icon);
                    setIcon(getMainIcon(id, sunset, sunrise), main_icon);
                    setWeekdays(language);

                } else {
                    console.error(`${cod_status}. ${cod_status_msg}`);
                }

            } catch (error) {
                console.error(error);
            }
        }, error);
    }
    function error(err) {
        // UNFINISHED!
        console.warn(`${err.message}`);
        document.body.textContent = 'Geolocation not available. This app relies heavily on it.';
    }
});

function init() {
    const els_a = document.querySelectorAll('[id$="content"]');
    const els_b = document.querySelectorAll('.temperature-alt');
    preloader.classList.add('fade-out');

    if (window.matchMedia("(max-width: 835px)").matches) {
        location_name.classList.add('fade-in', 'delay-500');
        main_icon.classList.add('fade-in', 'delay-750');
        weather_info.classList.add('fade-in', 'delay-1000');
        temperature.classList.add('degree');
    } else {
        location_name.classList.add('fade-in', 'delay-500');
        weather_info.classList.add('fade-in', 'delay-750');
        main_icon.classList.add('fade-in', 'delay-1000');
        temperature.classList.add('degree');
    }

    els_a.forEach((element) => {
        element.classList.add('fade-in', 'delay-700');
    });

    els_b.forEach((element) => {
        element.classList.add('degree');
    });

    document.getElementById('preloader').addEventListener('animationend', () => {
        preloader.className = '';
    });
}

/*********************** menu ***********************/
save_btn.addEventListener('click', applySettings);
cancel_btn.addEventListener('click', applySettings);

function applySettings(e) {
    if (e.target.classList.contains('disabled')) {
        return
    }
    else if (save_btn.contains(e.target)) {
        saveSettings();
    }
    else if (cancel_btn.contains(e.target)) {
        toggleMenu();
    }
}

// monitor changes
const observer = new MutationObserver(() => {
    save_btn.classList.remove('disabled');
    cancel_btn.classList.remove('disabled');
});

document.querySelector('.options-container').addEventListener('click', () => {
    observer.observe(document.querySelector('.options-container'), {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    });
});

document.querySelector('div:not(.options-container)').addEventListener('click', () => {
    observer.disconnect();
});

function toggleMenu() {
    loadSettings();
    grayscale();
    burger_icon.classList.toggle('change');
    burger_panel.classList.toggle('open-close');
}

function grayscale() {
    main_panel.classList.toggle('grayscale-content');
    const els = document.querySelectorAll('.forecast-icon');

    els.forEach((element) => {
        element.classList.toggle('grayscale-content');
    });
}

document.querySelector('.burger-icon').addEventListener('click', toggleMenu);
document.addEventListener("click", closeMenu);
document.addEventListener("touchend", closeMenu);

function closeMenu(e) {
    if (burger_panel.contains(e.target) || burger_icon.contains(e.target)) {
        return;
    } else if (burger_panel.classList.contains('open-close')) {
        toggleMenu();
    }
}

document.querySelector('.options-container').addEventListener('click', (e) => {
    if (light_theme_option.contains(e.target) || dark_theme_option.contains(e.target)) {
        if (e.target.classList.contains('active')) {
            return
        } else {
            light_theme_option.classList.toggle('active');
            dark_theme_option.classList.toggle('active');
        }
    }
    if (celsius_option.contains(e.target) || fahrenheit_option.contains(e.target)) {
        if (e.target.classList.contains('active')) {
            return
        } else {
            celsius_option.classList.toggle('active');
            fahrenheit_option.classList.toggle('active');
        }
    }
});
/*********************** menu ends ***********************/

function saveSettings() {
    const active_els = document.querySelector('.options-container').getElementsByClassName('active');
    let theme_selection = active_els[0].id.split('-')[0];
    let unit_selection = active_els[1].id.split('-')[0];
    localStorage.setItem('theme', theme_selection);
    localStorage.setItem('unit', unit_selection);
    location.reload();
}

function loadSettings() {
    const class_name = 'active';
    const els = document.getElementsByClassName(class_name);
    save_btn.classList.add('disabled');
    cancel_btn.classList.add('disabled');

    while (els[0]) {
        els[0].classList.remove(class_name);
    }

    if (current_theme == 'light' || current_theme == null) {
        light_theme_option.classList.toggle(class_name);
        theme = 'light';
    } else {
        dark_theme_option.classList.toggle(class_name);
        document.documentElement.setAttribute("data-theme", "dark");
        theme = 'dark';
    }
    if (current_unit == 'celsius' || current_unit == null) {
        celsius_option.classList.toggle(class_name);
        temp_unit = 'celsius';
    } else {
        fahrenheit_option.classList.toggle(class_name);
        temp_unit = 'fahrenheit';
    }
}

function setIcon(id, iconID) {
    const skycons = new Skycons({
        color: current_theme == 'dark' ? 'dark' : 'light', 'resizeClear': true
    });
    skycons.play();
    return skycons.set(iconID, Skycons[id]);
}

function getMainIcon(id, sunset, sunrise) {
    let date = new Date(),
        hours = date.getHours();

    if (sunset != null && sunrise != null) {
        sunset = new Date(sunset * 1000).getHours();
        sunrise = new Date(sunrise * 1000).getHours();
    }

    if (typeof id === 'number') {
        if (id >= 200 && id <= 531) {
            id = 'RAIN';
        }
        else if (id == 611) {
            id = 'SLEET';
        }
        else if (id >= 600 && id <= 622) {
            id = 'SNOW';
        }
        else if (id >= 701 && id <= 781) {
            id = 'FOG';
        }
        else if (id == 800) {
            if (hours >= sunset && sunset != null || hours <= sunrise && sunrise != null) {
                id = 'CLEAR_NIGHT';
            } else {
                id = 'CLEAR_DAY';
            }
        }
        else if (id >= 801 && id <= 802) {
            if (hours >= sunset && sunset != null || hours <= sunrise && sunrise != null) {
                id = 'PARTLY_CLOUDY_NIGHT';
            } else {
                id = 'PARTLY_CLOUDY_DAY';
            }
        }
        else if (id >= 803 && id <= 804) {
            id = 'CLOUDY';
        } else {
            throw Error('INVALID ID');
        }
        return id;
    }
    throw Error('PARAMETER IS NaN');
}

function setWeekdays(locale) {
    const today = new Date();
    let day1 = new Date(),
        day2 = new Date(),
        day3 = new Date(),
        day4 = new Date();

    day1.setDate(today.getDate() + 1);
    day2.setDate(today.getDate() + 2);
    day3.setDate(today.getDate() + 3);
    day4.setDate(today.getDate() + 4);

    let options = {
        weekday: 'short',
    };

    day_1_weekday.textContent = day1.toLocaleDateString(locale, options);
    day_2_weekday.textContent = day2.toLocaleDateString(locale, options);
    day_3_weekday.textContent = day3.toLocaleDateString(locale, options);
    day_4_weekday.textContent = day4.toLocaleDateString(locale, options);
}

function shortenLangCode(lang) {
    if (lang == null) {
        lang = default_language;
    }
    else if (lang.includes("-")) {
        lang = lang.substring(0, lang.indexOf("-"));
    }
    return lang;
}

function filterData(data) {
    const regexp = /([0-9]+-[0-9]+-[0-9])\w+/;
    const date_now = data.list[0].dt_txt.match(regexp)[0];
    return data = data.list.filter((v) => (v.dt_txt.indexOf('15:00:00') !== -1 && v.dt_txt.match(regexp)[0] !== date_now));
}

let icons = document.querySelectorAll('[id$="-icon"]');

for (let i = 0; i < icons.length; ++i) {
    dpiScaling(icons[i]);
}

function dpiScaling(el) { // canvas scaling
    const width = el.width;
    const height = el.height;
    const pixelRatio = window.devicePixelRatio || 1;
    const ctx = el.getContext("2d")
    const canvas = el;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(pixelRatio, pixelRatio);
}

// open iOS PWA (Progressive Web App) links in browser
(function (a, b, c) {
    if (c in b && b[c]) {
        var d, e = a.location,
            f = /^(a|html)$/i;
        a.addEventListener("click", function (a) {
            d = a.target;
            while (!f.test(d.nodeName)) d = d.parentNode;
            "href" in d && (d.href.indexOf("http") || ~d.href.indexOf(e.host)) && (a.preventDefault(), e.href = d.href)
        }, !1)
    }
})(document, window.navigator, "standalone")