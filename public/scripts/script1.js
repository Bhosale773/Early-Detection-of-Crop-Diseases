// animate eye icon

$(document).ready(function() {
    $("#passinput").on("keyup", function(){
        if($("#passinput").val()){
            $(".form1 .eyeicon").removeClass("d-none");
        }else{
            $(".form1 .eyeicon").addClass("d-none");
        }
    });
});

// set eye icon function

$(document).ready(function() {
    var time = 0, timeOut = 0;  
    var x = document.getElementById("passinput");
    $("form .eyeicon").on('mousedown touchstart', function(e) {
        x.type = "text"; 
        timeOut = setInterval(function(){
            console.log(time++);
        }, 100);
    }).bind('mouseup mouseleave touchend', function() {
        x.type = "password"; 
        clearInterval(timeOut);
    });
});

// Get the modal

var modal = document.querySelectorAll('.mod');

// When the user clicks anywhere outside of the modal, close it

window.onclick = function(event) {
    for(var i=0; i<modal.length; i++){
        if (event.target == modal[i]) {
            modal[i].style.display = "none";
        }
    }
}

// make navbar collapsed when avatar icon is clicked

$("nav .avatar").on("click",function(){
    $("nav .navbar-toggler").addClass("collapsed");
    $("nav .navbar-toggler").attr("aria-expanded","false");
    $("nav .navbar-collapse").removeClass("show");
});
