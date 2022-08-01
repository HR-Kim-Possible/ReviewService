const request = require('supertest')('http://localhost:8080');
var expect = require('chai').expect;

describe('get review for single product', function() {
  it('should respond with a 200 status code with no query parameters', async function() {
    const response = await request.get('/reviews/?product_id=40348');
    expect(response.status).to.eql(200);
    expect(response.body.product).to.eql('40348');
    expect(response.body.count).to.eql(5);
    expect(response.body.page).to.eql(0);
    expect(response.body.results.length).to.eql(5);
  });

  it('should respond with a 200 status code with query parameters', async function() {
    const response = await request.get('/reviews/?product_id=40348&sort=newest&count=6&page=2');
    expect(response.status).to.eql(200);
    expect(response.body.product).to.eql('40348');
    expect(response.body.count).to.eql(6);
    expect(response.body.page).to.eql(1);
    expect(response.body.results.length).to.eql(6);
  });
});

describe('post review for single product', function() {
  it('should respond with a 201 status code', async function() {
    this.timeout(10000);
    const response = await request.post('/reviews')
      .send(
        {
          'product_id': 40348,
          'rating': 5,
          'summary': 'eeeee11',
          'body': 'ccccccc22',
          'recommend': true,
          'name': 'Nickname',
          'email': 'Email@ee.com',
          'photos': [
            'http://res.cloudinary.com/dxhzukgow/image/upload/v1659130059/rv6os77efgt5n31okbs51.png'
          ],
          'characteristics': { '135001': 5, '135002': 5, '135003': 5, '135004': 5 }
        }
      );
    expect(response.status).to.eql(201);
  });
});

describe('put review helpful for single product', function() {
  it('should respond with a 204 status code', async function() {
    const response = await request.put('/reviews/5774953/helpful')
      .send({'review_id': 5774953});
    expect(response.status).to.eql(204);
  });
});

describe('put review report for single product', function() {
  it('should respond with a 204 status code', async function() {
    const response = await request.put('/reviews/5774953/report')
      .send({'review_id': 5774953});
    expect(response.status).to.eql(204);
  });
});

describe('get meta review for single product', function() {
  it('should respond with a 200 status code with no query parameters', async function() {
    const response = await request.get('/reviews/meta?product_id=40348');
    expect(response.status).to.eql(200);
    expect(response.body.product_id).to.eql('40348');
    expect(response.body.ratings).to.be.an('object');
    expect(response.body.recommended).to.be.an('object');
    expect(response.body.characteristics).to.be.an('object');

  });
});
