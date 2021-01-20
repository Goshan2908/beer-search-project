const addbeer = document.querySelectorAll("#addbeer");

addbeer.forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    const beername = el.parentNode.children[0].innerText;
    const imagebeer = el.parentNode.children[1].children[0].src;
    const abv = el.parentNode.children[2].innerText;
    const food = el.parentNode.children[3].innerText;
    console.log(beername, imagebeer, abv, food);
    fetch("/user/addbeer", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ beername, imagebeer, abv, food }),
    });
  });
});
