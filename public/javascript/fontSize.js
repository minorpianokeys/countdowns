const titles = document.querySelectorAll('#title');

titles.forEach(title => {
    const numChar = title.innerHTML.split('').length
    if(numChar > 30) {
        title.style.fontSize = "25px"
    } else if(numChar > 20) {
        title.style.fontSize = "25px"
    } else if(numChar > 15) {
        title.style.fontSize = "30px"
    } else if(numChar > 10) {
        title.style.fontSize = "35px"
    }
})