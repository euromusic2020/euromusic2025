$(document).ready(function () {
    setFilters();
    stopLoading();
    removeCorepetitor();
    setValidationMessages();
    $('#myForm')
        .on('keydown', 'input', function (event) {
            if (event.which == 13) {
                event.preventDefault();
            }
        })
        .on('submit', function (e) {
            // Prevent form submission
            e.preventDefault();
            $('#age').val(_calculateAge(new Date($('#birth_date').val())));
            $('#total_length').val(_calculateDuration([$('#length_1').val(), $('#length_2').val(), $('#length_3').val()]));
            // Get the form instance
            var $form = $(e.target);
            $form.validate();
            // Use Ajax to submit form data
            var url = 'https://script.google.com/macros/s/AKfycbzVsKz5dlnb_69A7F0E5wqBVApz6dfP9dTPsNQ_bPF1IZPsgcw/exec';

            // Show Loading
            startLoading();

            var jqxhr = $.get(url, $form.serialize(), function (data) {
                    console.log("Success! Data: ", data);
                    goTo(6);
                    stopLoading();
                })
                .fail(function (data) {
                    console.warn("Error! Data: ", data);
                    // HACK - check if browser is Safari - and redirect even if fail b/c we know the form submits.
                    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                        goTo(6);
                        // alert("Browser is Safari -- we get an error, but the form still submits -- continue.");             
                    } else {
                        goTo(7);
                    }
                    stopLoading();
                });
        });
});



let switches = document.getElementsByClassName('tab-switch');

function goTo(position) {
    const currentPosition = ($('.tab-switch').index($('.tab-switch:checked')));
    if ($('.tab-switch')[position].disabled && currentPosition <= position) {
        let validMove = true;
        $('.tab-switch:checked').next().next().find('select').each(function () {

            if (!($(this).is(':valid'))) {
                validMove = false;
                $(this).valid();
            }
        });
        $('.tab-switch:checked').next().next().find('input').each(function () {
            if (!($(this).is(':valid'))) {
                validMove = false;
                $(this).valid();
            }

        });
        if (!validMove) {
            return;
        }
    }
    for (let i = 0; i < switches.length; i++) {
        if (switches[i].checked) {
            switches[i].checked = false;
        }
    }
    switches[position].checked = true;
    switches[position].disabled = false;
    $('.tab-switch:checked').next().next()[0].scrollIntoView();
}

let selectedDate = document.getElementById('day_of_competition');
let categoriesElem = document.getElementById('category');

function changeCategories() {
    clearCategories();
    const newOptions = [];
    switch (selectedDate.value) {
        case '6':
            newOptions.push(newOption("Spev"));
            break;
        case '18':
            newOptions.push(newOption("Klavír"));
            break;
        case '19':
            newOptions.push(newOption("Akordeón"));
            newOptions.push(newOption("Dychové nástroje"));
            newOptions.push(newOption("Gitara"));
            newOptions.push(newOption("Klavír"));
            break;
        case '22':
            newOptions.push(newOption("Akordeón"));
            newOptions.push(newOption("Dychové nástroje"));
            newOptions.push(newOption("Gitara"));
            break;
    }
    newOptions.forEach(opt => {
        categoriesElem.add(opt);
    })
    categoriesElem.onchange();
    $(categoriesElem).valid();
}

function newOption(opt) {
    let option = document.createElement('option');
    option.text = opt;
    option.value = opt;
    return option;
}

function resetForm() {
    clearCategories();
}

function clearCategories() {
    for (let i = categoriesElem.length; i >= 0; i--) {
        categoriesElem.options[i] = null;
    }
}

function removeCorepetitor() {
    if (categoriesElem.value !== "Spev" &&
        categoriesElem.value !== "Dychové nástroje") {
        $('#main-tab-content').removeClass('tab-content-XL');
        $('#main-tab-content').addClass('tab-content-L');
        $('#corepetitor-field').hide();
    } else {
        $('#main-tab-content').removeClass('tab-content-L');
        $('#main-tab-content').addClass('tab-content-XL');
        $('#corepetitor-field').show();
    }
}

function setFilters() {
    setInputFilter(document.getElementById("length_1"), function (value) {
        return /^\d*\:?\d*$/.test(value); // Allow digits and ':' only, using a RegExp
    });
    setInputFilter(document.getElementById("length_2"), function (value) {
        return /^\d*\:?\d*$/.test(value); // Allow digits and ':' only, using a RegExp
    });
    setInputFilter(document.getElementById("length_3"), function (value) {
        return /^\d*\:?\d*$/.test(value); // Allow digits and ':' only, using a RegExp
    });
}

function startLoading() {
    $('.arrow').hide();
    $('.lds-spinner').show();
    $('#container').addClass('overlay');
}

function stopLoading() {
    $('.arrow').show();
    $('.lds-spinner').hide();
    $('#container').removeClass('overlay');
}

function setValidationMessages() {
    jQuery.extend(jQuery.validator.messages, {
        required: "Toto pole je povinné.",
        remote: "Prosím opravte toto pole.",
        email: "Zadajte validnú emailovú adresu.",
        date: "Zadajte platný dátum.",
        dateISO: "Zadajte platný dátum.",
        number: "Zadajte číslo.",
        digits: "Zadajte iba číslice.",
        max: jQuery.validator.format("Prosím zadajte hodnotu menšiu ako {0}."),
        min: jQuery.validator.format("Prosím zadajte hodnotu väčšiu ako {0}."),
        minlength: "Zadajte dĺžku v správnom formáte: mm:ss"
    });
}

function _calculateDuration(inputs) {
    console.log(inputs[0], ' and ', inputs[1], ' and ', inputs[2]);
    let totalSeconds = 0;
    inputs.forEach(input => {
        const minutes = input.split(':')[0];
        const seconds = input.split(':')[1];
        totalSeconds += parseInt(seconds) + 60 * parseInt(minutes);
    })
    let totalMinutes = totalSeconds / 60;
    totalSeconds = totalSeconds % 60;
    return Math.floor(totalMinutes) + ':' + totalSeconds;
}

function _calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function formatInput(event) {
    let $target = $(event.target);
    const currValue = $target.val();
    console.log(currValue, $target.val().match('^\d{2}$'));
    if ($target.val().match(/^\d{2}$/)) {
        console.log('match');
        $target.val(currValue + ':');
    }
}

// Restricts input for the given textbox to the given inputFilter function.
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}