const request = require('supertest')('http://localhost:3000/a');
var expect = require('chai').expect;

xdescribe('get review for single product', function() {
  it('should respond with a 200 status code with no query parameters', async function() {
    const response = await request.get('/reviews/40348');
    expect(response.status).to.eql(200);
    expect(response.body.product).to.eql('40348');
    expect(response.body.count).to.eql(5);
    expect(response.body.page).to.eql(0);
    expect(response.body.results.length).to.eql(5);
  });

  it('should respond with a 200 status code with query parameters', async function() {
    const response = await request.get('/reviews/40348?sort=newest&count=6&page=2');
    expect(response.status).to.eql(200);
    expect(response.body.product).to.eql('40348');
    expect(response.body.count).to.eql(6);
    expect(response.body.page).to.eql(1);
    expect(response.body.results.length).to.eql(6);
  });
});

xdescribe('put review helpful for single product', function() {
  it('should respond with a 204 status code', async function() {
    const response = await request.put('/reviews/40348/helpful')
      .send({'review_id': 5774953});
    expect(response.status).to.eql(204);
  });
});

xdescribe('put review report for single product', function() {
  it('should respond with a 204 status code', async function() {
    const response = await request.put('/reviews/40348/report')
      .send({'review_id': 5774953});
    expect(response.status).to.eql(204);
  });
});

xdescribe('get meta review for single product', function() {
  it('should respond with a 200 status code with no query parameters', async function() {
    const response = await request.get('/reviews/40348/meta');
    expect(response.status).to.eql(200);
    expect(response.body.product_id).to.eql('40348');
    expect(response.body.ratings).to.be.an('object');
    expect(response.body.recommended).to.be.an('object');
    expect(response.body.characteristics).to.be.an('object');

  });
});
