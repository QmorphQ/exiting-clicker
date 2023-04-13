import sheet from './ModalWindow.css' assert { type: 'css' };
document.adoptedStyleSheets = [sheet];
const modalWindow = document.createElement("div");
modalWindow.setAttribute("class", "modal-window");
modalWindow.innerHTML = "<h1>Hello</h1>";
export default modalWindow;