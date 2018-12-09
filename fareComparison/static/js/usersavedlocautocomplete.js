(function ($) {
    "use strict"; // Start of use strict

    $(document).ready(function () {
        var count = 0;
        //Fetch useremail from cookies
        console.log("cookies : " + document.cookie);

        var mycookie = document.cookie;
        var useremail = mycookie.split('=')[1];
        console.log("useremail :" + useremail);
    });

})(jQuery);

// Creates a Textbox
function GetDynamicTextBox(count) {
    "use strict";
    //    return '<div class="col-sm-8 col-sm-offset-3"><div class="form-group"><input type="text" class="form-control" id="vialocation' + count + '" name="location" placeholder="via Location" list="locationsList" onInput="createdatalist(this)"></div></div>';
    //
    return '<div class="form-group"><label for="end" class="control-label col-sm-3">Address</label><div class="col-sm-8 col-sm-offset-3"><input type="text" class="form-control" id="vialocation' + count + '" name="location" placeholder="Address" list="locationsList" onInput="createdatalist(this)" onchange="validateData(this)"/></div><div class="col-xs-1"><a id="remove" title ="Delete via Location" onclick="removeTextbox(this)"><i class="fa fa-times-circle-o fa-1x" style="color:white;"></i></a></div></div>';
}

// Removes Google prediction options from datalist 
function removePredictOptions(mydatalist) {
    "use strict";
    for (var i = mydatalist.options.length - 1; i >= 0; i--) {
        console.log("Inside remove datalist option function");
        if (mydatalist.options[i].id == "predloc") {
            mydatalist.removeChild(mydatalist.options.item(i));
        }
    }
}

// Creates adds options to datalist dynamically based on user input
function createdatalist(textbox) {
    console.log("Inside my DataList");
    var currenttextbox = textbox.id
    var userinput = $("#" + currenttextbox).val();

    var found = false;
    var datalist = document.getElementById("locationsList")
    for (var i = datalist.options.length - 1; i >= 0; i--) {
        console.log(datalist.options[i].value);
        if (userinput === (datalist.options[i].value)) {
            found = true;
            console.log("Found Match");
            break;
        }
    }

    if (!found) {
        // Remove old predictions from datalist
        removePredictOptions(datalist);

        // Callback function for google autocomplete service
        var displaySuggestions = function (predictions, status) {
            console.log("Inside callback for predictions");
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                console.log(status);
                return;
            }
            predictions.some(function (prediction) {
                console.log("Inside Google predictions loop");
                if ((prediction.description) === userinput) {
                    console.log("same as google prediction");
                    return;
                }

                $("#locationsList").append('<option id="predloc" value="' + prediction.description + '"> </option>')
            });
            console.log("Size of datalist : " + document.getElementById("locationsList").options.length);
        };

        // Call Google Autocomplete service to fetch predictions based on user input
        var service = new google.maps.places.AutocompleteService();
        console.log(userinput)
        if (userinput != "") {
            service.getPlacePredictions({
                input: userinput
            }, displaySuggestions);
        }
    }
};

function removeTextbox(elem) {
    console.log("Inside remove textbox function");
    //Remove Textbox on icon click
    $(elem).parent().parent().remove();
}


// Validates Location Textboxes
function validateData(elem) {
    var validdata = false;
    console.log("Inside Validate Data")
    console.log($(elem).val());
    var datalist = document.getElementById("locationsList")
    for (var i = datalist.options.length - 1; i >= 0; i--) {
        if ((datalist.options[i].value) === ($(elem).val())) {
            validdata = true;
            $(elem).parent().parent().removeClass("has-feedback");
            $(elem).parent().children().remove(".glyphicon");
            $(elem).removeClass("incorrectdata")
            break;
        }
    }

    if (!validdata) {
        console.log("Correct the Data");
        $(elem).parent().parent().addClass("has-feedback");
        $(elem).after('<span class="glyphicon glyphicon-remove form-control-feedback" style="color:red"></span>');
        $(elem).addClass("incorrectdata");
    }
}