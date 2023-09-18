if(typeof window != `undefined`) {
    console.log(`Running navbar.js...`);
    
    const elm = document.querySelector(`.navbar-root`);
    const fg = document.querySelector(`.fg`);

    let threshold = 10;

    const scrollFunc = () => {
        if(fg.scrollTop > threshold && !elm.classList.contains(`navbar-solid`)) {
            console.log(`Adding navbar-solid...`);
            elm.classList.add(`navbar-solid`);
            fg.classList.add(`fg-scrolled`);
        } else if(fg.scrollTop <= threshold && elm.classList.contains(`navbar-solid`)) {
            console.log(`Removing navbar-solid...`);
            elm.classList.remove(`navbar-solid`);
            fg.classList.remove(`fg-scrolled`);
        }
    };

    fg.addEventListener(`scroll`, scrollFunc);
} else console.log(`Skipping navbar.js...`);