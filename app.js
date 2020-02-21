$(document).ready(function () {
    stopLoading();
    $('#age').val(10);
    $('#total_length').val('total');
    $('#myForm')
        .on('submit', function (e) {
            console.log('lets go');
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

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
                        stopLoading();
                        //alert("Browser is Safari -- we get an error, but the form still submits -- continue.");             
                    }
                });
        });
});


function _calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

let switches = document.getElementsByClassName('tab-switch');

function goTo(position) {
    for (let i = 0; i < switches.length; i++) {
        if (switches[i].checked) {
            switches[i].checked = false;
        }
    }
    switches[position].checked = true;
    switches[position].disabled = false;
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
    console.log(categoriesElem.value !== "Spev" &&
    categoriesElem.value !== "Dychové nástroje");
    if (categoriesElem.value !== "Spev" &&
            categoriesElem.value !== "Dychové nástroje") {
        $('#corepetitor-field').hide();
    } else {
        $('#corepetitor-field').show();
    }
}

function startLoading() {
    $('.lds-spinner').show();
    $('#container').addClass('overlay');
}

function stopLoading() {
    $('.lds-spinner').hide();
    $('#container').removeClass('overlay');
}