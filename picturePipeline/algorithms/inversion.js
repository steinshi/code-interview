function invertColor(picture) {
    picture.forEach((row, rowIndex) => {
        row.forEach((pixel, pixelIndex) => {
            picture[rowIndex][pixelIndex] = 255 - picture[rowIndex][pixelIndex];
        })
    });
    return picture;
}

module.exports = { invertColor };
