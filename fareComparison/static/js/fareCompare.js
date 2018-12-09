// function to plot optimized route on google maps


function plotMap(latlongList,places) {
	var coords = []; //array to store co-ordinates of optimized route
	for (var j=0; j< places.length; j++) {
		var title = places[j];
		var value = latlongList[j];
		coords.push(value);    
	}
	console.log(coords, '6666')
	
//    var poly;
    var stopsList = [];
    $.each( coords, function( index, value ){
        var pitStops = {};        
        pitStops["title"] = places[index];
        pitStops["lat"] = value[0]
        pitStops["lng"] = value[1]
        console.log(value[0],value[1])
        stopsList.push(pitStops);        
    });
    console.log('stoplis',stopsList)


	var infoWindow = new google.maps.InfoWindow();

    var mapOptions = {
        zoom: 0,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("canvas-map"), mapOptions);

    var lat_lng = new Array();
    var latlngbounds = new google.maps.LatLngBounds();
	var markers = [];

    for (var i = 0; i < stopsList.length; i++) {
		var data = stopsList[i];
		console.log('data', data)
		var myLatlng = new google.maps.LatLng(data.lat, data.lng);
        lat_lng.push(myLatlng);
		var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: stopsList[i].title,
        });
        latlngbounds.extend(marker.position);
        (function (marker, data) {
            google.maps.event.addListener(marker, "click", function (e) {
                infoWindow.setContent(data.title);
                infoWindow.open(map, marker);
            });
        })(marker, data);
    }
    map.setCenter(latlngbounds.getCenter());
    map.fitBounds(latlngbounds);

      //***********ROUTING****************//

  //Initialize the Direction Service
  var service = new google.maps.DirectionsService({});
  console.log('se', service)
  console.log('lat_lng', lat_lng)

  //Loop and Draw Path Route between the Points on MAP
  for (var i = 0; i < lat_lng.length; i++) {
    if ((i + 1) < lat_lng.length) {
      var src = lat_lng[i];
      var des = lat_lng[i + 1];
      console.log('ssss', src,des)
      service.route({
        origin: src,
        destination: des,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      }, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          //Initialize the Path Array
          var path = new google.maps.MVCArray();
          console.log('pay', path)
          //Set the Path Stroke Color
          var poly = new google.maps.Polyline({
            map: map,
            strokeColor: '#4986E7'
          });
          poly.setPath(path);
          for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
            path.push(result.routes[0].overview_path[i]);
          }
        }
      });
    }
  }

}

//function to plot bar chart for price comparison
function plotChart(uberPrice,lyftPrice, uberPool, uberX, uberXL, black,
					lyft_line, lyft, lyft_plus, lyft_lux) {
	console.log("--jiayi----------")
	console.log(uberPool, uberX, uberXL, black,
					lyft_line, lyft, lyft_plus, lyft_lux)
	document.getElementById('uberPool').value = uberPool;
    document.getElementById('uberX').value = uberX;
    document.getElementById('uberXL').value = uberXL;
    document.getElementById('black').value = black;
    document.getElementById('uberlower').value = Math.min(uberPool, uberX, uberXL, black);

    document.getElementById('lyft_line').value = lyft_line;
    document.getElementById('lyft').value = lyft;
    document.getElementById('lyft_plus').value = lyft_plus;
    document.getElementById('lyft_lux').value = lyft_lux;
    document.getElementById('lyftlower').value = Math.min(lyft_line, lyft, lyft_plus, lyft_lux);

//    $('#tripmap').show();
//	$('#rateChart').show();
}


//function to plot bar chart for price comparison
function plotChart_time(uberPool_time, uberX_time, uberXL_time, black_time,
					lyft_line_time, lyft_time, lyft_plus_time, lyft_lux_time) {
	console.log("--jiayi time----------")
	console.log(uberPool_time, uberX_time, uberXL_time, black_time,
					lyft_line_time, lyft_time, lyft_plus_time, lyft_lux_time)
	document.getElementById('uberPool_time').value = uberPool_time;
    document.getElementById('uberX_time').value = uberX_time;
    document.getElementById('uberXL_time').value = uberXL_time;
    document.getElementById('black_time').value = black_time;
//    document.getElementById('uberlower_time').value = Math.min(uberPool_time, uberX_time, uberXL_time, black_time);

    document.getElementById('lyft_line_time').value = lyft_line_time;
    document.getElementById('lyft_time').value = lyft_time;
    document.getElementById('lyft_plus_time').value = lyft_plus_time;
    document.getElementById('lyft_lux_time').value = lyft_lux_time;
//    document.getElementById('lyftlower_time').value = Math.min(lyft_line_time, lyft_time, lyft_plus_time, lyft_lux_time);

    $('#tripmap').show();
	$('#rateChart').show();
}


//function to display best route in the UI
function plotDirections(places){
	if ($('#routePlan').children().length >= 1){
		$('#routePlan').children().remove();			
	}
	$.each( places, function( index, value ){
		 var content = '<div class="ui-block-a" style ="margin:5px;">'
		content += '<textarea name="Text1" cols="40" rows="3" class="form-control"  id="loc_'+index+'" readonly/>'
		content += '</div>'
        $('#routePlan').append(content);
		$('#loc_'+index).val( (index+1)+"   " +value);			
    });
}


(function ($) {
    "use strict"; // Start of use strict

    $(document).ready(function () {


        // Highlight the top nav as scrolling occurs
        $('body').scrollspy({
            target: '.navbar-fixed-top',
            offset: 51
        });

        // Closes the Responsive Menu on Menu Item Click
        $('.navbar-collapse ul li a').click(function () {
            $('.navbar-toggle:visible').click();
        });

        // Offset for Main Navigation
        $('#mainNav').affix({
            offset: {
                top: 100
            }
        });

        // Initialize and Configure Scroll Reveal Animation
        window.sr = ScrollReveal();
        sr.reveal('.sr-icons', {
            duration: 600,
            scale: 0.3,
            distance: '0px'
        }, 200);
        sr.reveal('.sr-button', {
            duration: 1000,
            delay: 200
        });
        sr.reveal('.sr-contact', {
            duration: 600,
            scale: 0.3,
            distance: '0px'
        }, 300);

        // Initialize and Configure Magnific Popup Lightbox Plugin
        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
            }
        });

        // User Login
        $('#login').click(function () {
            console.log("inside login function");
            window.location.replace("/index");
        });

        //User Log Out
        $('#logout').click(function () {
            console.log("inside logout function");
            window.location.replace("/logout");
        });


        // Hide the Trip Map div when page is first loaded
        $('#tripmap').hide();
		
		$('#rateChart').hide();

        // On click of button "Plan My Trip" collects information from server about best route ,Uber and Lyft prives and shows visualization
        $('#planmytrip').click(function () {
            console.log("Inside plan trip button function");

            // On button click show the div meant for visualization
//            $('#rateChart').show();
            $('#rateChart').show();

			//creating user data in json format to be used for the google optimized route api
			var origin = $("#start").val();
			var destination = $("#end").val();
			var waypoints =[];
			$("input[id^=vialocation]").each(function() {
				waypoints.push($(this).val());
			});
			var inData =[{"origin":origin,"destination":destination,"waypoints":waypoints}];			
			$.ajax({
				 type: "POST",
				 url: "http://localhost:5000/fetchPrices",
				 data: JSON.stringify(inData),
				 contentType: "application/json",
				 dataType: "json",
				 beforeSend: function(){
					// Show image container
					$("#loader").show();
				 },
				 success: function (data, status, jqXHR) {
					console.log("success===");
					var places = data[0].places;
					var noOfStops = places.length;
					var uberPrice = (data[0].uberPrice != 0) ? data[0].uberPrice : 'N/A';
					var uberPool = (data[0].uberPool != 0) ? data[0].uberPool : 'N/A';
					var uberX = (data[0].uberX != 0 ) ? data[0].uberX : 'N/A';
					var uberXL = (data[0].uberXL != 0) ? data[0].uberXL : 'N/A';
					var black = (data[0].black != 0) ? data[0].black : 'N/A';

					var lyftPrice = (data[0].lyftPrice != 0) ? data[0].lyftPrice : 'N/A';
					var lyft_line = (data[0].lyft_line != 0) ? data[0].lyft_line : 'N/A';
					var lyft = (data[0].lyft != 0) ? data[0].lyft : 'N/A';
					var lyft_plus = (data[0].lyft_plus != 0) ? data[0].lyft_plus : 'N/A';
					var lyft_lux = (data[0].lyft_lux != 0) ? data[0].lyft_lux : 'N/A';

					var locationLatLng = data[0].locationLatLng;
					var locationLatLngList = data[0].locationLatLngList;
					console.log('picejiayi', lyft, lyft_line, uberPool)
					console.log("---------------------")
					plotMap(locationLatLngList,places);
					console.log('plotttt')
					plotChart(uberPrice,lyftPrice, uberPool, uberX, uberXL, black,
					lyft_line, lyft, lyft_plus, lyft_lux);
					plotDirections(places);
				},
				complete:function(data){
                   // Hide image container
                    $("#loader").hide();
                },
				error: function (jqXHR, status) {
						console.log(status);
						$('#canvas-map').append('<div class="alert alert-danger" role="alert"><strong>We are unable to display your best optimized route at this point.</strong>Please try submitting again.</div>');

				}
			});


			$.ajax({
				 type: "POST",
				 url: "http://localhost:5000/fetchTimes",
				 data: JSON.stringify(inData),
				 contentType: "application/json",
				 dataType: "json",
				 beforeSend: function(){
					// Show image container
					$("#loader").show();
				 },
				 success: function (data, status, jqXHR) {
					console.log("success!!!!", data, 'mmmm');
					var uberPool_time = data[0].uberPool;
					var uberX_time = data[0].uberX;
					var uberXL_time = data[0].uberXL;
					var black_time = data[0].black;

					var lyft_line_time = data[0].lyft_line;
					var lyft_time = data[0].lyft;
					var lyft_plus_time = data[0].lyft_plus;
					var lyft_lux_time = data[0].lyft_lux;

					plotChart_time(uberPool_time, uberX_time, uberXL_time, black_time,
					lyft_line_time, lyft_time, lyft_plus_time, lyft_lux_time);
				},
				complete:function(data){
                   // Hide image container
                    $("#loader").hide();
                },
				error: function (jqXHR, status) {
						console.log(status);
						$('#canvas-map').append('<div class="alert alert-danger" role="alert"><strong>We are unable to display your best optimized route at this point.</strong>Please try submitting again.</div>');

				}
			});



            // scroll to the visualization div
            $('html,body').animate({
                scrollTop: $("#rateChart").offset().top - 150
            }, 'slow');

            //Fetch the start , end and via locations
            var startlocation = $("#start").val();
            var endlocation = $("#end").val();
            var vialocations = [];
            $("input[name=vialocation]").each(function () {
                vialocations.push($(this).val());
            });

            console.log("Start: " + startlocation);
            console.log("End: " + endlocation);
            console.log("ViaLocations: " + vialocations);

            //Sample GET and POST call .
            // TO DO : Replace them with actual calls
            var output = $.get("https://jsonplaceholder.typicode.com/posts/1");
            console.log("Output from server :" + JSON.stringify(output) + ":" + output.readyState);

            var postoutput = $.post("https://jsonplaceholder.typicode.com/posts", {
                title: 'foo',
                body: 'bar',
                userId: 1
            });
            console.log("Post output:" + JSON.stringify(postoutput));


        });


    });
})(jQuery); // End of use strict
