function getImageUrl(filename) {
    return `http://localhost:3001/image/${filename}`;
}

module.exports = { getImageUrl };