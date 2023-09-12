import anime from 'animejs';

const overrides = {
    THEGREATDOWNUNDER: {
        heading: {
            transform: 'rotate(180deg)',
        },
        rain: '/static/user/vb.png'
    }
}

for(const [ name, o ] of Object.entries(overrides)) {
    if(o.rain) {
        const value = o.rain;
        
        o.rain = (element) => {
            if(typeof element == `string`) element = document.querySelector(element);

            const images = Array.from(Array(15).keys()).forEach(() => {
                const i = document.createElement('img');
    
                i.src = value;

                const size = Math.min((window.innerHeight*0.15), (window.innerWidth*0.15));
                
                i.style.width = `${size}px`;
                i.style.height = `${size}px`;
                i.style.position = `absolute`;
                //i.style.pointerEvents = `none`;
                i.style.top = `-30px`;
    
                // add to top of element
                element.prepend(i);

                const start = () => {
                    const delay = Math.random() * 2000;

                    const opacity = 0.5

                    i.style.pointerEvents = `auto`;
                    i.style.transform = `scale(1)`
                    i.style.left = `${Math.random() * 100}%`;
        
                    anime({
                        targets: i,
                        top: [`-${size + (size * 5/3)}px`, window.innerHeight + 30],
                        opacity: [opacity, opacity, opacity, 0],
                        rotate: [(Math.random() * 720)-360, (Math.random() * 720)-360],
                        duration: (Math.random() * 500)+1750,
                        easing: `linear`,
                        delay,
                        complete: () => start()
                    });
                }; start();

                const enterFunc = (e) => {
                    i.onmouseover = null;

                    const currentPos = {
                        x: e.clientX,
                        y: e.clientY,
                    };

                    let timeout;

                    i.onmousemove = (e2) => {
                        clearTimeout(timeout);
                        
                        const newPos = {
                            x: e2.clientX,
                            y: e2.clientY,
                        };

                        const diff = {
                            x: newPos.x - currentPos.x,
                            y: newPos.y - currentPos.y,
                        };

                        if(diff.x && diff.y) {
                            i.onmousemove = null;

                            i.style.pointerEvents = `none`;
    
                            e2.preventDefault();
    
                            anime.remove(i);

                            const elm = {
                                y: parseFloat(e2.target.style.top),
                                x: parseFloat(e2.target.style.left),
                            };

                            const raw = {
                                y: (diff.y * (size/45)),
                                x: (diff.x * (size/45))
                            }
    
                            const mult = 45;

                            const mvmts = {
                                top: elm.y + raw.y,
                                left: elm.x + raw.x,
                                rotate: (Math.random() * mult)-(mult/2),
                            }
    
                            anime({
                                targets: i,
                                ...mvmts,
                                opacity: [i.style.opacity, 0],
                                scale: 0.5,
                                duration: 2000,
                                easing: `easeOutCirc`,
                                complete: () => {
                                    i.onmouseover = enterFunc;
                                    start();
                                }
                            });
                        }
                    };

                    timeout = setTimeout(() => {
                        i.onmousemove = null;
                        i.onmouseover = enterFunc;
                    }, 150)
                }

                i.onmouseover = enterFunc
            });
        }
    }
}

export default {
    '76561199077754911': overrides.THEGREATDOWNUNDER,
    '76561198345634943': overrides.THEGREATDOWNUNDER
}