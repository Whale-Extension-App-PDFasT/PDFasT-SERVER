
<?php
    header('Access-Control-Allow-Origin:*');
    $test = $_POST["test"];
    $test2 = $_FILES["test"];
   	echo("local <br/>");
	// echo($test);
    echo($test2);
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>'Hello, world!' example</title>
</head>
  <link type="text/css" href="./../static/pdfjs/build/text_layer_builder.css" rel="stylesheet"></link>
<script type="text/javascript" src="./../static/pdfjs/build/text_layer_builder.js"></script>


<body id="total">
  
<!-- <canvas></canvas> -->
<div id="container"></div>

<script src="./../static/pdfjs/build/pdf.js"></script>

<script id="script">
  //
  
  var canvasElement = document.querySelector("canvas");
  var file = "<?=$test2?>";
	var BASE64_MARKER = ';base64,';
  function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}
	
	    pdfjsLib.getDocument(convertDataURIToBinary(file)).then(function(pdf) {
      // you can now use *pdf* here
      var container = document.getElementById("container");
  var k=1;
    // Loop from 1 to total_number_of_pages in PDF document
    for (var i = 1; i <= pdf.numPages; i++) {
    
        // Get desired page
        pdf.getPage(i).then(function(page) {

          var scale = 1.5;
          var viewport = page.getViewport(scale);
          var div = document.createElement("div");

          // Set id attribute with page-#{pdf_page_number} format
          div.setAttribute("id", "page-" + (page.pageIndex + 1));

          // This will keep positions of child elements as per our needs
          div.setAttribute("style", "position: relative");

          // Append div within div#container
          container.appendChild(div);

          // Create a new Canvas element
          var canvas = document.createElement("canvas");

          // Append Canvas within div#page-#{pdf_page_number}
          div.appendChild(canvas);

          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          var renderContext = {
            canvasContext: context,
            viewport: viewport,
			  isViewerEmbedded: false,
			  focusPreviewer: true, // Auto-focus the previewer to allow keyboard shortcuts directly after instantiation
			  allowPrinting: true, // Show a "Print" button
			  allowDownload: true, // Show a "Download" button which downloads the current document
			  allowBookmark: true, // Show a "Bookmark" button which gives an URL that reproduces the exact current view. If disabled, hides the button and ignores the URL hash parameters.
			  allowUrlQuery: true, // Allow changing the file with URL like `viewer.html?file=foo.pdf`
			  allowOpenFile: true // Allow previewer to open new files.
          };

          // Render PDF page
          page.render(renderContext).then(function() {
                // Get text-fragments
                return page.getTextContent();
            })
            .then(function(textContent) {
                // Create div which will hold text-fragments
                var textLayerDiv = document.createElement("div");

                // Set it's class to textLayer which have required CSS styles
                textLayerDiv.setAttribute("class", "textLayer");

                // Append newly created div in `div#page-#{pdf_page_number}`
                div.appendChild(textLayerDiv);

                // Create new instance of TextLayerBuilder class
                var textLayer = new TextLayerBuilder({
                textLayerDiv: textLayerDiv, 
                pageIndex: page.pageIndex,
                viewport: viewport
                });

                // Set text-fragments
                textLayer.setTextContent(textContent);

                // Render text-fragments
                textLayer.render();
       
            });
      
  });
    
    }

    });
	


  
</script>
<pre id="code"></pre>


</body>

</html>
