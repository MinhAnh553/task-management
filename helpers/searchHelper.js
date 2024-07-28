module.exports = (query) => {
    const keyWord = query.keyword;
    const regExp = new RegExp(keyWord, 'i');
    return regExp;
};
