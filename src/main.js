import  './styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const form = document.getElementById("rss-form");
const input = document.getElementById("url-input");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = input.value.trim();

  if (!url) {
    alert("Пожалуйста, введите ссылку RSS");
    return;
  }

  console.log("Добавляем RSS:", url);
  input.value = "";
});

