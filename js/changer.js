let appChanger = function() {
    let items = $('.stepFirst__item');
    let itemIn = $('[data-item-in]');
    let itemOut = $('[data-item-out]');

    let stepsTopItem = $('.steps__item');

    let selectedTitle = $('.selected__empty');
    let selectedRezult = $('.selected__bottom');
    let selectedCalc = $('.selectedCours__calc');
    let selectedTimer = $('.selectedCours__timer');
    let selectedIn = $('.selected__in');
    let selectedOut = $('.selected__out');

    let currentStep = 1;
    let goToNextBtn = $('.js_goToNext');

    let iconIn;
    let iconOut;
    let nameIn;
    let nameOut;
    let coursIn;
    let coursOut;
    let valueIn;
    let valueOut;
    let reservOut;
    let timerCount;

    let choosenItemTempl;
    let choosenItemLength;

    let circleTimer;
    let circleTimerCount;
    let newTimer;

    goToNextBtn.attr('disabled', true);

    items.on('click', function() {
        selectItem($(this));
    });

    function selectItem(elem) {
        let itemIsSelected = elem.hasClass('selected');

        if (elem.data('item-in')) {
            iconIn = elem.data('icon');
            nameIn = elem.data('name');
            coursIn = elem.data('cours');
            valueIn = elem.data('value');

            // console.log(nameIn, coursIn, valueIn);
            stylingItem(itemIn, elem);
            if (itemIsSelected) {
                removeSelectedItem(elem);
            } else {
                appendItemInSide(elem, iconIn, nameIn, valueIn);
            }
        }
        if (elem.data('item-out')) {
            iconOut = elem.data('icon');
            nameOut = elem.data('name');
            coursOut = elem.data('cours');
            valueOut = elem.data('value');
            reservOut = elem.data('reserv');
            timerCount = elem.data('timer');

            // console.log(nameOut, coursOut, valueOut, reservOut);
            stylingItem(itemOut, elem);
            if (itemIsSelected) {
                removeSelectedItem(elem);
            } else {
                appendItemInSide(elem, iconOut, nameOut, valueOut);
            }
        }
    }

    function stylingItem(all, elem) {
        all.not(elem).removeClass('selected');
        elem.toggleClass('selected')
    }

    function removeSelectedItem(elem) {
        let itemId = elem.data('id');
        // console.log(itemId);

        $('#' +itemId).remove();

        toggleSelectedInfo();
        return false;
    }

    function appendItemInSide(elem, icon, name, value) {
        let elemIn = elem.data('itemIn');
        let elemOut = elem.data('itemOut');
        // console.log(choosenItemLength);
        // console.log(coursIn+':'+coursOut);
        // console.log(elem.hasClass('selected'));
        choosenItemTempl = `<div class="selected__item" id="`+elem.data('id')+`">
                        <div class="selected__icon"><img src="`+icon+`" alt=""/></div>
                        <div class="selected__name">`+name+`</div>
                        <div class="selected__val">`+value+`</div>
                    </div>`;

        if (elemIn) {
            selectedIn.html(choosenItemTempl);
        }

        if (elemOut) {
            selectedOut.html(choosenItemTempl);
        }

        toggleSelectedInfo();


    }

    function toggleSelectedInfo() {
        choosenItemLength = $('.selected__item').length;

        // console.log(choosenItemLength);

        if (choosenItemLength > 0) {
            selectedTitle.hide();
        } else {
            selectedTitle.show();
        }

        if (choosenItemLength == 2) {
            selectedCalc.html(coursIn+':'+coursOut);
            selectedRezult.show();
            runCircleTimer(timerCount);
            goToNextBtn.attr('disabled', false);
        } else {
            selectedRezult.hide();
        }

    }

    function runCircleTimer(timeInSec) {
        let timerTemplate = `<div id="circle_timer" class="timer">
            <div class="timer__text">`+timeInSec+`</div>
        </div>`;

        clearInterval(newTimer);
        selectedTimer.html(timerTemplate);

        circleTimer = $('#circle_timer');
        circleTimerCount = $('.timer__text');

        circleTimer.circleProgress({
            startAngle: -Math.PI / 4 * 2,
            thickness: 3,
            size: 32,
            value: 1,
            animationStartValue: 0,
            animation: {
                duration: timeInSec*1000,
                easing: "linear"
            },
            lineCap: 'round',
            fill: "#055bcb",
            emptyFill: "rgba(0, 0, 0, 0.1)"
        });

        newTimer = setInterval(function () {
            i = circleTimerCount.text();
            i--;
            circleTimerCount.text(i);
        }, 1000);

        circleTimer.on('circle-animation-end', function(event) {
            console.log('end timer');
            clearInterval(newTimer);
            circleTimerCount.text(0);
            circleTimer.circleProgress({fill: "#F00",animationStartValue: 1})
        })
    }

    goToNextBtn.on('click', function() {
        gotToNextStep();
    });

    function toggleStepsTab() {
        stepsTopItem.each(function(index, el) {
            if (index < currentStep) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }

    function gotToNextStep() {
        $('.main__left').addClass('main__left_hide');
        toggleStepsTab();
        if (currentStep !== 3) {
            currentStep++;
        }
        toggleFirstStep();
        toggleFormsStep();
        goToNextBtn.attr('disabled', true);
    };

    function toggleFirstStep() {
        let stepFirst = $('.stepFirst');
        if (currentStep === 1) {
            stepFirst.removeClass('minimize');
        } else {
            stepFirst.addClass('minimize');
        }
    }

    function toggleFormsStep() {
        let stepSecond = $('.stepSecond');
        toggleStepsTab();
        console.log(currentStep);
        if (currentStep === 2 ) {
            stepSecond.removeClass('hide stepLast');
            $('.selectedCours').appendTo('.stepSecond__cours');
            $('.stepLast__code').hide();
            $('.form__privacy').show();
            setAutoWidthInput();
            validateExchangeForm();
        } else if (currentStep === 3 ) {
            stepSecond.removeClass('hide');
            stepSecond.addClass('stepLast');
            $('.stepLast__code').show();
            $('.form__privacy').hide();
            setAutoWidthInput();
        } else {
            stepSecond.addClass('hide');
        }
    }

    function setAutoWidthInput() {
        let fields = $('input').not('.js_codeField');
        // let fWidth = 0;

        fields.each(function(index, el) {
            if (currentStep === 2) {
                $(this).removeAttr('style');
                $(this).prop('readonly', false);
            } else {
                $(this).width((($(this).val().length +1) * 0.5)+ 'em');
                $(this).prop('readonly', true);
            }
        });
    }

    function fixedFormLabel() {
        $('input').on('blur', function() {
            if ($(this).val()) {
                $(this).addClass('valid');
                $(this).removeClass('invalid');
            } else {
                $(this).addClass('invalid');
                $(this).removeClass('valid');
            }
            validateExchangeForm();
        })
    }
    fixedFormLabel();

    function validateExchangeForm() {
        let required = $('[required]');
        let empty = 0;
        required.each(function(index, el) {
            if ($(this).val() === '') {
                empty++;
            }
        });
        // console.log(empty);
        if (empty === 0) {
            goToNextBtn.attr('disabled', false);
        } else {
            goToNextBtn.attr('disabled', true);
        }
    }

    $('.form__edit').on('click', function() {
        currentStep--;
        toggleFormsStep();
    })





// gotToNextStep();

};

appChanger();
