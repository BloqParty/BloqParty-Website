const asyncLoadImage = (url) => new Promise(async res => {
    const img = new Image();
    img.addEventListener(`load`, () => res(img));
    img.src = url;
});

export default asyncLoadImage;