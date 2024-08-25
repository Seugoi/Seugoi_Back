function getStudyImageUrl(filename) {
    return `http://localhost:3001/study-image/${filename}`;
}

function getCommentImageUrl(filename) {
    return `http://localhost:3001/comment-image/${filename}`;
}

function getTaskImageUrl(filename) {
    return `http://localhost:3001/task-image/${filename}`;
}


module.exports = { getStudyImageUrl, getCommentImageUrl, getTaskImageUrl };