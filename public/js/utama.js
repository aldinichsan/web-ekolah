document.querySelector(".search-klik").addEventListener("click", function () {
    var element = document.getElementById("search-input");
    element.classList.toggle("invisibel");
    
});

// panggil navbar
const navBar = document.getElementById("nav");
const navCont = document.getElementById("item")

function scroll() {
    let calc = window.scrollY; // mendapatkan posisi scroll dari atas ke bawah
    if (calc > 10) { // jika posisi scroll lebih dari 0 pixel
        navBar.classList.add("bg-color");
        // navBar.classList.add("warna");
        // navCont.classList.add("warna");
    } else if (calc <= 10) { // jika posisi scroll sama dengan 0 pixel
        navBar.classList.remove("bg-color");
        // navBar.classList.remove("warna");
        // navCont.classList.remove("warna");
    }
  }
  window.onscroll = () => { // jika tidak work untuk arrow function, coba pakai function biasa
    scroll();
  };