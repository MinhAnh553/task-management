module.exports = (objectPagination, req, totalRecord) => {
    if (req.query.page) {
        objectPagination.currentPage = req.query.page;
    }
    if (req.query.limit) {
        objectPagination.limitRecord = req.query.limit;
    }

    objectPagination.totalPage = Math.ceil(
        totalRecord / objectPagination.limitRecord
    );
    objectPagination.skip =
        (objectPagination.currentPage - 1) * objectPagination.limitRecord;
    return objectPagination;
};
