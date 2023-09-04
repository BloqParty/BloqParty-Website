import React, { useEffect } from 'react';
import anime from "animejs";

const fgStyles = [
    {
        backdropFilter: ``,
    },
    {
        backdropFilter: `blur(40px) grayscale(40%)`,
    }
];

export default class Wallpaper {
    constructor(bg, fg) {
        this.bg = bg
        this.fg = fg
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
                for(const [k,v] of Object.entries(fgStyles[0])) this.fg.style[k] = v;
                res();
            }
        });
    })

    set = ({ duration = 3500, url } = {}) => new Promise(async res => {
        console.log(`Setting wallpaper to "${url}"... (current: ${this.current})`);

        if(this.current === url) {
            return res();
        } else {
            this.current = url;
            
            if(this.bg.style.backgroundImage) await this.hide({ duration: 500, remove: false });
    
            anime.remove(this.bg);
            anime({
                targets: this.bg,
                opacity: [0, 1],
                duration,
                scale: [1, 1.15],
                easing: `easeOutExpo`,
                begin: () => {
                    this.bg.style.backgroundImage = `url("${url}")`;
                    for(const [k,v] of Object.entries(fgStyles[1])) this.fg.style[k] = v;
                }
            });
        }
    })
};