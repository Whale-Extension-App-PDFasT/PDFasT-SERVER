
// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
//
var url = '<?=$test?>';
var finaltext = "";
//
// The workerSrc property shall be specified.
//
pdfjsLib.GlobalWorkerOptions.workerSrc =
    './../static/pdfjs/build/pdf.worker.js';

//
// Asynchronous download PDF
//
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function (pdf) {
    //
    // Fetch the first page
    //
    var container = document.getElementById("container");
    var k = 1;
    // Loop from 1 to total_number_of_pages in PDF document
    for (var i = 1; i <= pdf.numPages; i++) {

        // Get desired page
        pdf.getPage(i).then(function (page) {

            var scale = 1.5;
            var viewport = page.getViewport(scale);
            var div = document.createElement("div");

            // Set id attribute with page-#{pdf_page_number} format
            div.setAttribute("class", "page");
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
            page.render(renderContext).then(function () {
                // Get text-fragments
                return page.getTextContent();
            })
                .then(function (textContent) {
                    // Create div which will hold text-fragments
                    var textLayerDiv = document.createElement("div");

                    // Set it's class to textLayer which have required CSS styles
                    textLayerDiv.setAttribute("class", "textLayer");

                    // Append newly created div in `div#page-#{pdf_page_number}`
                    div.appendChild(textLayerDiv);

                    // Create new instance of TextLayerBuilder class                

                    maxPage = page.pageIndex + 1;

                    var textLayer = new TextLayerBuilder({
                        textLayerDiv: textLayerDiv,
                        pageIndex: page.pageIndex,
                        viewport: viewport
                    });

                    // Set text-fragments
                    textLayer.setTextContent(textContent);

                    // Render text-fragments
                    textLayer.render();

                }).then(function () {
                    $('#container_back').hide();

                    if (localStorage) {
                        let st = localStorage;
                        let loading = [];
                        loading.push({ bool: true });

                        st.setItem('loading', JSON.stringify(loading));
                    }
                });

        });

    }

});
  
  

        $(function(){
            $('#page_bar')
                .animate({
                    top: '0px'
                }, 200)
                .animate({
                    top: '-0px'
                }, 400)
                .animate({
                    top: '-60px'
                }, 200, () => {
                    document.getElementById("page_bar").style.opacity = "0";
                    document.getElementById("page_bar").style.top = "0px";
                });
        });
            $(document).on('mouseover', '.page', function () {
                var ex = /[-]/gi;
                // console.log($(this).attr('id').split(ex)[1]);
                nowPage = $(this).attr('id').split(ex)[1];
            });


        $(window).scroll(function(event){
            $('#page_bar_title span:nth-child(1)').text(nowPage);
        $('#page_bar_title span:nth-child(2)').text(' / ' + $('#container')[0].children.length);
        });