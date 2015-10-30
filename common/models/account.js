module.exports = function(Account) {
Account.observe('before save', function (ctx, next) {
    if (ctx.instance) {
        ctx.instance.lastModifiedAt = new Date();
    }
    else {
        ctx.data.lastModifiedAt = new Date();
    }
    next();
});
};
