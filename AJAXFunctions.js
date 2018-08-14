window.onload = collectComments();

// Send image link and description from a user to the server
function addComment() {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            collectComments();
        }
    };

    // get value from the form
    var name = document.getElementById("name").value;
    var comment = document.getElementById("comment").value;

    // blank out the form
    document.getElementById("name").value = '';
    document.getElementById("comment").value = '';

    // make and send the request
    var params = "requestType=collectComments&name=" + name + "&comment=" + comment;
    xmlhttp.open("POST", "cgi-bin/image_interface.cgi", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);

    // Note that this function creates a POST request. This behaves the same as a GET request except the parameter do not
    // appear in the url. Instead, we send the parameters inside the send function. This is processed in python in
    // the same way as a GET request. We have a need for POST requests since the inputs can now contain spaces which
    // are not allowed inside a url.

    //getElementById(elementId)
}

function collectComments() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            // Parse and write the results of the request to the empty div with the id allImages
            document.getElementById("allComments").innerHTML = parseCollectComments(xmlhttp.responseText);
        }
    };
    // We can use a GET request since there are no variables
    xmlhttp.open("GET", "cgi-bin/image_interface.cgi?requestType=collectComments", true);
    xmlhttp.send();
}

// generate an HTML table with the image and description
function parseCollectComments(comment) {
	
    var parsed = "";
    parsed += '<div class="text">\n';
    parsed += '<table class="table table-bordered"><tbody>';
    
	var count = 0;
	var allComments = JSON.parse(comment);
	
    for (var i in allComments) {
		var entry = allComments[i];
        var name = entry[0];
        var comment = entry[1];
		
		if(count == 0){
			parsed += '<tr class="info">';
		}
//Creating rows
        parsed += '<td><center>' + name + '<br><br><h5>' + comment + '</h5></center></td>';
		count += 1;
		
		if(count == 1){
			parsed += '</tr>'
			count = 0;
		}
    }
	
	if(parsed > 0){
		parsed += '</tr>'
	}
	
    parsed += '</table>';
    parsed += '</div>\n\n';
    return parsed;
}

