const addbeer = document.querySelector('#addbeer');
addbeer.addEventListener('click', (event) => {
  event.preventDefault()
  const beername = document.querySelector("#beername").innerHTML;
  const imagebeer = document.querySelector("#imagebeer").src;
  const abv = document.querySelector("#abv").innerHTML;
  const food = document.querySelector("#food").innerHTML;
  fetch("/user/addbeer", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ beername, imagebeer, abv, food }),
  });
})

