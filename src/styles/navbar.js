let navlistenerset = false;

if(typeof window != `undefined`) {
    if(!navlistenerset) {
        console.log(`Running navbar.js...`);
        
        let elm = document.querySelector(`.navbar-root`);
        let fg = document.querySelector(`.fg`);
    
        if(elm && fg) {
            let threshold = 10;
            let lastScroll = 0;
        
            const scrollFunc = () => {        
                if(window.innerWidth <= 600) {
                    const difference = lastScroll - fg.scrollTop;
        
                    if(Math.abs(difference) > threshold) {    
                        if(difference < 0 && !elm.classList.contains(`navbar-solid`)) {
                            console.log(`Adding navbar-solid...`);
                            elm.classList.add(`navbar-solid`);
                            fg.classList.add(`fg-scrolled`);
                        } else if(difference > 0 && elm.classList.contains(`navbar-solid`)) {
                            console.log(`Removing navbar-solid...`);
                            elm.classList.remove(`navbar-solid`);
                            fg.classList.remove(`fg-scrolled`);
                        }
            
                        lastScroll = fg.scrollTop;
                    }
                } else {
                    if(fg.scrollTop > threshold && !elm.classList.contains(`navbar-solid`)) {
                        console.log(`Adding navbar-solid...`);
                        elm.classList.add(`navbar-solid`);
                        fg.classList.add(`fg-scrolled`);
                    } else if(fg.scrollTop <= threshold && elm.classList.contains(`navbar-solid`)) {
                        console.log(`Removing navbar-solid...`);
                        elm.classList.remove(`navbar-solid`);
                        fg.classList.remove(`fg-scrolled`);
                    }
                }
            };
        
            fg.addEventListener(`scroll`, scrollFunc);
        
            navlistenerset = true;
        } else console.log(`Error: navbar.js: scrollFunc: elm or fg is null.`);
    }
} else console.log(`Skipping navbar.js...`);