let $ = require('jquery');
let Typed = require('typed.js');
require('jquery-knob');
require('slick-carousel');


(function () {
    $(window).on('load', function () {
        // code to execute 
        __has_header();
        onLoad();

    });

    $(document).ready(function () {
        preloader('#loader-wrapper', 4000);
        __has();
    });
})();

let __has = function (data) {
    let __has = {
        init: function () {
            this.stickynav('header', 'navbar_fixed');
            this.typed(['WordPress Developer', 'Linux Freak', 'FrontEnd Developer', 'WordPress Fanatic']);
            this.knob('.skill', '#013243');
            this.knob('.skill-f', '#1abc9c');
            this.slick('.testimonial-items');
        },
        // setting navbar sticky
        stickynav: function (elem, class_name) {
            $(window).on('scroll', function () {
                var scroll_top = $(window).scrollTop();
                if (scroll_top >= 40) {
                    $(elem).addClass(class_name);
                } else {
                    $(elem).removeClass(class_name);
                }
            });
        },
        // Typed Js
        typed: function (string) {
            new Typed('.typed', {
                strings: string,
                typeSpeed: 40,
                backSpeed: 60,
                shuffle: true,
                smartBackspace: true,
                loop: true,
                cursorChar: ' &Colone;',
            });
        },
        // Knob Js 
        knob: function (class_name, color) {
            $(class_name).knob({
                width: '95%',
                skin: "tron",
                fgColor: color,
                readOnly: true,
                thickness: '.4',
                lineCap: 'round',
                displayInput: true,
                inputColor: color
            });
        },
        // Slick Slider
        slick: function (class_name) {
            $(class_name).slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                arrows: false
            });
        }

    };
    // Call The Function
    data = __has.init();
    return data();
};



// Log Rocket Function
let __has_header = function () {
    return window.LogRocket && window.LogRocket.init('f0lnrk/my-portfolio');
};

// Page Speed On Browser about Application Performance
function onLoad() {
    var now = new Date().getTime();
    var page_load_time = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log("Page loaded in: " + page_load_time / 1000 + ' sec');
}

//Preloader Function
let preloader = function (id, time){
    $(id).fadeOut(time);
}