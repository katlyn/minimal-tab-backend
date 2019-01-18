const transition = {
    in: image => {
      return new Promise(res => {
        document.body.style.background = `url(${image}) no-repeat center center fixed`
        document.body.style.backgroundSize = 'cover'
        let overlay = document.getElementById('overlay')
        let content = document.getElementById('content')
        
        let overlayPromise = new Promise(overlayRes => {
          overlay.addEventListener('transitionend', () => {
            overlayRes()
          }, { once: true })
        })
        let secondaryPromise = new Promise(secondaryRes => {
          content.addEventListener('transitionend', () => {
            secondaryRes()
          }, { once: true })
        })

        overlay.classList.add('transparent')
        content.classList.add('show')

        Promise.all([overlayPromise, secondaryPromise]).then(() => {
          res()
        })
      })
    },
    out: image => {
      return new Promise(res => {
        let overlay = document.getElementById('overlay')
        let content = document.getElementById('content')
        
        let overlayPromise = new Promise(overlayRes => {
          overlay.addEventListener('transitionend', () => {
            overlayRes()
          }, { once: true })
        })
        let secondaryPromise = new Promise(secondaryRes => {
          content.addEventListener('transitionend', () => {
            secondaryRes()
          }, { once: true })
        })

        overlay.classList.remove('transparent')
        content.classList.remove('show')

        Promise.all([overlayPromise, secondaryPromise]).then(() => {
          res()
        })
      })
    }
  }

fetch(`https://minimal.gordhoard.org/api/random/${(window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait'}`)
  .then(res => { return res.json() })
  .then(currentImage => {
    const credits = document.getElementById('image-credits')
    credits.textContent = `Image by ${currentImage.credit.name} on Unsplash`
    credits.href = currentImage.credit.url
    // Fade in image
    let background = new Image()
    background.src = `${currentImage.url}${(window.innerWidth > window.innerHeight) ? '&w=' + window.screen.width : '&h=' + window.screen.height}`
    background.onload = () => {
      transition.in(`${currentImage.url}${(window.innerWidth > window.innerHeight) ? '&w=' + window.screen.width : '&h=' + window.screen.height}`)
    }
  })


