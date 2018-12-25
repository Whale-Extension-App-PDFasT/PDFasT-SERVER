
var modal = document.getElementById('myModal');

var span = document.getElementsByClassName("close")[0];

var bcgDiv = document.getElementById("divBackground");

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
	window.close();

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        btn.style.display = "block";
        bcgDiv.style.display = "none";
    }
}
