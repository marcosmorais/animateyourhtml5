function apply_css_filters(id, grayscale, sepia, blur, dropshadow, huerotate)
{
    var nod = document.getElementById(id);
    nod.style.webkitFilter = "grayscale("+grayscale+'%'+") sepia("+sepia+'%'+") blur("+blur+'px'+") drop-shadow("+dropshadow+'px '+dropshadow+'px '+(dropshadow/2)+'px '+"gray) hue-rotate("+huerotate+"deg)";
}
function change_filter_text_dropshadow(id, dropshadow)
{
    var nod = document.getElementById(id);
    nod.innerText = "-webkit-filter: drop-shadow("+dropshadow+'px '+dropshadow+'px '+(dropshadow/2)+'px '+"gray)";
}
function change_filter_text_grayscale(id, grayscale)
{
    var nod = document.getElementById(id);
    nod.innerText = "-webkit-filter: grayscale("+grayscale+'%'+")";
}
function change_filter_text_sepia(id, sepia)
{
    var nod = document.getElementById(id);
    nod.innerText = "-webkit-filter: sepia("+sepia+'%'+")";
}
function change_filter_text_blur(id, blur)
{
    var nod = document.getElementById(id);
    nod.innerText = "-webkit-filter: blur("+blur+'px'+")";
}
function change_filter_text_huerotate(id, huerotate)
{
    var nod = document.getElementById(id);
    nod.innerText = "-webkit-filter: hue-rotate("+huerotate+"deg)";
}
