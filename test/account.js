describe('account', function() {
  before(function(done) {
    app.models.Account.destroyAll(done);
  });
  after(function(done) {
    app.models.Account.destroyAll(done);
  });

  context('before save', function() {
    it('should set `createdAt` if not set by the user', function(done) {
      app.models.Account.create({
        email: 'john.doe@ibm.com'
      }, function(err, account) {
        expect(err).to.be.null;
        expect(account.createdAt).to.be.an.instanceof(Date);
        done();
      });
    });

    it('should update `lastModifiedAt`', function(done) {
      app.models.Account.create({
        email: 'john.doe@ibm.com'
      }, function(err, account) {
        expect(err).to.be.null;
        expect(account.lastModifiedAt).to.be.an.instanceof(Date);
        done();
      });
    });
  });
});
