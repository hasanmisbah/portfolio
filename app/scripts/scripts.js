let $ = require('jquery');
let Typed = require('typed.js');
require('jquery-knob');


(function(){
    $(window).on('load', function(){
    // code to execute 
    __has_header();
    console.log('i am Loaded');
    
    });

    $(document).ready(function(){
       
        __has();
    });
})();

let __has = function(){
    let __has = {
        init : function(){
            this.stickynav('header', 'navbar_fixed');
            this.typed(['WordPress Developer', 'Linux Freak', 'FrontEnd Developer', 'WordPress Fanatic']);
            this.knob('.skill', '#013243');
            this.knob('.skill-f', '#1abc9c');
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
        typed : function(string){
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
        knob : function(class_name, color){
            $(class_name).knob({
                width : '95%',
                skin: "tron",
                fgColor : color,
                readOnly : true,
                thickness : '.4',
                lineCap : 'round',
                displayInput : true,
                inputColor : color
            });
        }

    };
    __has.init();
};


let __has_header = function(){
  return window.LogRocket && window.LogRocket.init('f0lnrk/my-portfolio');
};

