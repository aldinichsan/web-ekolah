const slider = tns({
    container: '.my-slider',
    loop: false,
    items: 1,
    slideBy: 'page',
    rewind: true,
    nav: false,    
    autoplay: false,
    speed: 400,
    autoplayButtonOutput: false,
    mouseDrag: true,
    lazyload: false,
    controlsContainer: "#customize-controls",
    responsive: {
        640: {
            items: 2,
        },
        
        768: {
            items: 4,
        }
    }

  });
