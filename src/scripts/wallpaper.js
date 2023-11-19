import React, { useEffect } from 'react';
import anime from "animejs";

import asyncLoadImage from '../util/asyncLoadImage';

const fgStyles = [
    {
        backdropFilter: ``,
        WebkitBackdropFilter: ``,
    },
    {
        backdropFilter: `blur(40px) grayscale(40%)`,
        WebkitBackdropFilter: `blur(40px) grayscale(40%)`,
    }
];

export default class Wallpaper {
    constructor(bg=document.querySelector(`.bg`), mg=document.querySelector(`.mg`), fg=document.querySelector(`.fg`)) {
        this.bg = bg
        this.mg = mg
        this.fg = fg

        this.startParallax()
    }

    parallaxDone = true;
    currentAnimeMovement = null;

    startParallax() {
        console.log(`Starting parallax...`);
        this.fg.addEventListener(`mousemove`, e => {
            if(this.parallaxDone && this.visible) {
                this.parallaxDone = false;
                requestAnimationFrame(() => {
                    if(this.currentAnimeMovement) {
                        this.currentAnimeMovement.pause();
                        delete this.currentAnimeMovement;
                        this.currentAnimeMovement = null;
                    }

                    const { clientX, clientY } = e
                    const moveX = clientX - window.innerWidth / 2
                    const moveY = clientY - window.innerHeight / 2
                    const offsetFactor = 35

                    this.currentAnimeMovement = anime({
                        targets: this.bg,
                        left: moveX / offsetFactor,
                        top: moveY / offsetFactor,
                        duration: 500,
                        easing: `easeOutExpo`,
                        begin: () => {
                            this.parallaxDone = true;
                        }
                    });
                })
            };
        });
    }

    get visible() {
        return this.bg.getAttribute(`current`) == this.current && this.bg.style.backgroundImage != ``;
    }

    set current(url) {
        this.bg.setAttribute(`current`, url);
    }

    get current() {
        return this.bg.getAttribute(`current`);
    }

    hide = ({ duration = 1000, remove = true } = {}) => new Promise(async res => {
        console.log(`Hiding wallpaper... (current: ${this.current})`);

        if(remove) this.current = ``;
        anime.remove(this.bg);
        anime({
            targets: this.bg,
            opacity: 0,
            duration,
            scale: 1.05,
            easing: `easeOutExpo`,
            complete: () => {
                this.bg.style.backgroundImage = ``;
                for(const [k,v] of Object.entries(fgStyles[0])) this.mg.style[k] = v;
                res();
            }
        });
    })

    set = ({ duration = 3500, url } = {}) => new Promise(async res => {
        console.log(`Setting wallpaper to "${url}"... (current: ${this.current})`);

        if(this.current === url) {
            return res();
        } else {
            let waits = [];
            
            if(this.bg.style.backgroundImage) waits.push(this.hide({ duration: 500, remove: false }));

            this.current = url;

            asyncLoadImage(url).then(() => {
                if(this.current == url) {
                    anime.remove(this.bg);
                    anime({
                        targets: this.bg,
                        opacity: [0, 1],
                        duration,
                        scale: [1, 1.15],
                        easing: `easeOutExpo`,
                        begin: () => {
                            this.bg.style.backgroundImage = `url("${url}")`;
                            for(const [k,v] of Object.entries(fgStyles[1])) this.mg.style[k] = v;
                        }
                    });
                }
            });
        }
    })
};