cardContainer = document.querySelectorAll('.card')

cardContainer.forEach(card => {
    let date = card.querySelector('.date').innerHTML;
    let countDownDate = new Date(date).getTime();

    function updateCount() {
        let now = new Date().getTime()
        let distance = countDownDate - now;
        let timer = card.querySelector('#timer');

        if(distance <= 0) {
            timer.innerHTML = `
                <div class="finish">
                    <div>Finished</div>
                </div>
                                `

        } else {
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
            if(days < 10) {
                days = `0${days}`
            }
            if(hours < 10) {
                hours = `0${hours}`
            }
            if(minutes < 10) {
                minutes = `0${minutes}`
            }
            if(seconds < 10) {
                seconds = `0${seconds}`
            }
            
            timer.innerHTML = `
                <div class="time">
                    <div>${days}</div>
                    <p>Days</p>
                </div>
                <div class="time">
                    <div>${hours}</div>
                    <p>Hours</p>
                </div>
                <div class="time">
                    <div>${minutes}</div>
                    <p>Minutes</p>
                </div>
                <div class="time">
                    <div>${seconds}</div>
                    <p>Seconds</p>
                </div>
                `
        }
}
    setInterval(updateCount, 1000)
})
