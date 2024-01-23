const asyncLoadImage = (url) => new Promise(async res => {
    if(typeof document != `undefined`) {
        const img = document.createElement('img');
        img.addEventListener(`load`, () => res(img));
        img.src = url;
    } else {
        res();
    }
});

export default asyncLoadImage;