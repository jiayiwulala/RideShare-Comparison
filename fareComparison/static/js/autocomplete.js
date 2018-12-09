function GetDynamicTextBox(count) {
    "use strict";
   return '<div class="form-group"><div class="col-xs-10 col-sm-8 col-sm-offset-3"><input type="text" class="form-control" id="vialocation' + count + '" name="vialocation" placeholder="via Location" onchange="validateData(this)"></div><div class="col-xs-1"><a id="remove" title ="Delete via Location" onclick="removeTextbox(this)"><i class="fa fa-times-circle-o fa-1x" style="color:white;"></i></a></div></div>';

}

function removeTextbox(elem) {
    console.log("Inside remove textbox function");
    $(elem).parent().parent().remove();
}

(function ($) {
    "use strict";
    $(document).ready(function () {
        var count = 0;
		
        //Adds dynamic textbox on plus icon click
        $('#addlocation').click(function () {
        console.log('click')
            count++;
            $('#vialocation').append(GetDynamicTextBox(count));
            var newEl = document.getElementById('vialocation' + count);
            var autocomplete = new google.maps.places.Autocomplete(newEl);
            console.log("Added Location Textbox");
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				validateData(newEl);
			});
        });


        $("#tripplan input[type=text]").each(function () {
            var input = $(this).attr("id");
            console.log(input);
            var autocomplete = new google.maps.places.Autocomplete(document.getElementById(input));
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				validateData(document.getElementById(input));
			});
			
        });
		
    });
})(jQuery);

//validate input to be one from the autocomplete list
function validateData(elem) {
	var validdata = false;
	var service = new google.maps.places.AutocompleteService();
	service.getPlacePredictions({input: $(elem).val()},function(predictions, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < predictions.length; i++) {
				if ((predictions[i].description) === ($(elem).val())) {
				validdata = true;
				$(elem).parent().parent().removeClass("has-feedback");
				$(elem).parent().children().remove(".glyphicon");
				$(elem).removeClass("incorrectdata");
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
	});	
}