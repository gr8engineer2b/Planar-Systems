window.addEventListener('DOMContentLoaded', editorResize);
window.addEventListener('resize', editorResize);

function editorResize() {
    var editor = document.getElementById("Editor");
    editor.style.width = `${Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)-28}px`;
    editor.style.height = `${Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)-28}px`;
};