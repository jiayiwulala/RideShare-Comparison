function loadPrevLocations(useremail) {
	var result = useremail.slice(1, -1);
	
	var apicall = "/locations/" + result;
        console.log("Location API Call :" + apicall);
        var userLocations;
        var locationsdata;
        $.get(apicall).done(function (data) {
            console.log("Output from my server :" + data);
            var output = JSON.parse(data);
			var count = 0;
            if (output.length > 0) {
                locationsdata = output[0].locations
                    console.log(locationsdata);
                    console.log(locationsdata.locations);
                userLocations = Object.keys(locationsdata);
                userLocations.forEach(function (location) {
					console.log("count",location);
							if(count == 0) {
								document.getElementById("loc1").innerHTML = location;
								if(document.getElementById("loc1").innerHTML !== ""){
									console.log("inside loc1");
									document.getElementById("loc1").style.visibility='visible';
									document.getElementById("loc1").value = location;
									document.getElementById("loc1addr").value = locationsdata[location];
								}
							} else if(count == 1) {
								document.getElementById("loc2").innerHTML = location;
								if(document.getElementById("loc2").innerHTML !== ""){
									document.getElementById("loc2").style.visibility='visible';
									document.getElementById("loc2").value = location;
									document.getElementById("loc2addr").value = locationsdata[location];
								}
							} else if(count == 2) {
								document.getElementById("loc3").innerHTML = location;
								if(document.getElementById("loc3").innerHTML !== ""){
									document.getElementById("loc3").style.visibility='visible';
									document.getElementById("loc3").value = location;
									document.getElementById("loc3addr").value = locationsdata[location];
								}
							} else if(count == 3) {
								document.getElementById("loc4").innerHTML = location;
								if(document.getElementById("loc4").innerHTML !== ""){
									document.getElementById("loc4").style.visibility='visible';
									document.getElementById("loc4").value = location;
									document.getElementById("loc4addr").value = locationsdata[location];
								}
							} else if(count == 4) {
								document.getElementById("loc5").innerHTML = location;
								if(document.getElementById("loc5").innerHTML !== ""){
									document.getElementById("loc5").style.visibility='visible';
									document.getElementById("loc5").value = location;
									document.getElementById("loc5addr").value = locationsdata[location];
								}
							}		
							count++;
                     });
            }
        });
}

(function ($) {
"use strict"; // Start of use strict

    $(document).ready(function () {
		var mycookie = document.cookie;
		var useremail = mycookie.split('=')[1];
		console.log("useremail :" + useremail);
		loadPrevLocations(useremail);
			
		$('#savelocations').click(function () {
			console.log("Inside plan trip button function");
			console.log("in function");
			
	        
			//Fetch the start , end and via locations
			var nameOfAddress = $("#nameOfAddress").val();
			var location = $("#address").val();
			var locationList =[];
			var locationMap = new Map();
			$("input[name=location]").each(function () {
				locationList.push($(this).val());
			});

			console.log("nameOfAddress: " + nameOfAddress);
			console.log("location: " + location);
			console.log("locationList: " + locationList);
			for(var i=0;i<locationList.length;i=i+2){
				locationMap.set(locationList[i],locationList[i+1]);
			}

			console.log(locationMap);
			var inData = [{"email":useremail,"locations":locationList}];
			console.log(inData);
			$.ajax({
				 type: "POST",
				 url: "http://localhost:5000/locations",
				 data: JSON.stringify(inData),
				 contentType: "application/json",
				 dataType: "json",
				 success: function (data, status, jqXHR) {
					  console.log("success");
					  loadPrevLocations(useremail);
					  document.getElementById("nameOfAddress").value = "";
					document.getElementById("address").value = "";
					document.getElementById("savelocations").value = "Save Locations";
					document.getElementById("deleteLocationDiv").style.visibility='hidden';
                },
				 error: function (jqXHR, status) {
						console.log(status);
			}});
			
			});
			$('#deletelocation').click(function () {
			//Fetch the start , end and via locations
			var nameOfAddress = $("#nameOfAddress").val();
			var location = $("#address").val();

			console.log("nameOfAddress: " + nameOfAddress);
			
			var inData = [{"email":useremail,"name":nameOfAddress}];
			console.log(inData);
			//var output = $.get("https://jsonplaceholder.typicode.com/posts/1");
			//console.log("Output from server :" + JSON.stringify(output) + ":" + output.readyState);
			$.ajax({
				 type: "DELETE",
				 url: "http://localhost:5000/locations/".concat(useremail),
				 data: JSON.stringify(inData),
				 contentType: "application/json",
				 dataType: "json",
				 success: function (data, status, jqXHR) {
						console.log(data);
					  document.getElementById("nameOfAddress").value = "";
					document.getElementById("address").value = "";
					document.getElementById("savelocations").value = "Save Locations";
					document.getElementById("deleteLocationDiv").style.visibility='hidden';
					$('#locationsDiv').load(window.location.href +  ' #locationsDiv');
					loadPrevLocations(useremail);
                },
				 error: function (jqXHR, status) {
						console.log(status);
			}});
			});
	});
})(jQuery);