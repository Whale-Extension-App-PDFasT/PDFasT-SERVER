<?php
    header('Access-Control-Allow-Origin:*');
    $test = $_POST["test"];
	// echo("web <br/>");
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
  
  // If absolute URL from the remote server is provided, configure the CORS
  // header on that server.
  //
  var url = '<?=$test?>';
  var finaltext="";
  //
  // The workerSrc property shall be specified.
  //
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    './../static/pdfjs/build/pdf.worker.js';

  //
  // Asynchronous download PDF
  //
  var loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(function(pdf) {
    //
    // Fetch the first page
    //
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
            viewport: viewport
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
