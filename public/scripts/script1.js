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