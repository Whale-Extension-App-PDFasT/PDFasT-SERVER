document.querySelector("#file-6").addEventListener("change", function (e) {
    var modal = document.getElementById('myModal');
    var ctb = document.getElementById('container_back');
    // Get the button that opens the modal

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    var bcgDiv = document.getElementById("divBackground");
    modal.style.display = "none";
    bcgDiv.style.display = "none";
	ctb.style.display = "block";
    var canvasElement = document.querySelector("canvas");
    var file = e.target.files[0];
    if (file.type != "application/pdf") {
        alert(file.name, "is not a pdf file.")
        return
    }


    var fileReader = new FileReader();

    fileReader.onload = function () {
        var typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedarray).then(function (pdf) {
            // you can now use *pdf* here
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
						    maxPage = page.pageIndex+1;
                            var textLayer = new TextLayerBuilder({
                                textLayerDiv: textLayerDiv,
                                pageIndex: page.pageIndex,
                                viewport: viewport
                            });

                            // Set text-fragments
                            textLayer.setTextContent(textContent);

                            // Render text-fragments
                            textLayer.render();


                        }).then(function(){
                            // console.log($('.page:nth-child(1) canvas').css('margin-left'));
                           $('.textLayer').css('left', $('.page:nth-child(1) canvas').css('margin-left'));
                           $('#container_back').hide();
               
               
          });


                });

            }

        });
    };

    fileReader.readAsArrayBuffer(file);
});
$(function () {
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

$("#popup_youtube").on('click', function (e) {
    // location.replace('https://youtu.be/mr2Llu8ZKeU');
    window.open('https://youtu.be/mr2Llu8ZKeU', 'PDFasT 가이드 영상');
});

		$("#pagenum").on('keyup', function (e) {
			if (e.keyCode == 13) {
				const getpagenum = $(this).val();
				if (getpagenum > maxPage) {
					getpagenum = maxPage;
				}
				const scrollpage = document.getElementById("page-" + getpagenum);

				scrollpage.scrollIntoView();
				// console.log(getpagenum);
			}
		});

		$(document).on('mouseover', '.page', function () {
			var ex = /[-]/gi;
			// console.log($(this).attr('id').split(ex)[1]);
			nowPage = $(this).attr('id').split(ex)[1];
		});


		$(window).scroll(function (event) {
			$('#page_bar_title input').val(nowPage);
			$('#page_bar_title span').text(' / ' + $('#container')[0].children.length);
		});