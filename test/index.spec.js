const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const recipes = require('../recipes.json');
const should = chai.should();


chai.use(chaiHttp);

describe('express_recipes_pagination', () => {

    it('Should return 200 for /recipes with default pagination', (done) => {
        chai.request(server)
            .get('/recipes')
            .then(response => {
                response.status.should.eql(200);
                response.body.should.eql(recipes.slice(0, 3));
                done()
            })
    });

    it('Should respond with correct data when only page is set in query', (done) => {
        chai.request(server)
            .get('/recipes?page=3')
            .then(response => {
                response.status.should.eql(200);
                response.body.should.eql(recipes.slice(6, 9));
                done()
            })
    });

    it('Should respond with correct data when only limit is set in query', (done) => {
        chai.request(server)
            .get('/recipes?limit=2')
            .then(response => {
                response.status.should.eql(200);
                response.body.should.eql(recipes.slice(0, 2));
                done()
            })
    });


    it('Should respond with correct data when both limit and page are set in query - 1', (done) => {
        chai.request(server)
            .get('/recipes?limit=2&page=3')
            .then(response => {
                response.status.should.eql(200);
                response.body.should.eql(recipes.slice(4, 6));
                done()
            })
    })

    it('Should respond with correct data when both limit and page are set in query - 2', (done) => {
        chai.request(server)
            .get('/recipes?limit=4&page=3')
            .then(response => {
                response.status.should.eql(200);
                response.body.should.eql(recipes.slice(8));
                done()
            })
    })

    it('Should respond with correct data when both limit and page are out of bounds', (done) => {
        chai.request(server)
            .get('/recipes?limit=3&page=4')
            .then(response => {
                response.status.should.eql(200);
                response.body.should.eql([]);
                done()
            })
    })
});

describe('express_recipes_filters', () => {

    it('Should return 400 for /recipes/shopping-list if no ids are passed in query', (done) => {
        chai.request(server)
            .get('/recipes/shopping-list')
            .then(response => {
                response.status.should.eql(400);
                done();
            })
    });

    it('Should respond back with a 404 if none of the ids match', (done) => {
        chai.request(server)
            .get('/recipes/shopping-list?ids=12,32,33,acasd')
            .then(response => {
                response.status.should.eql(404);
                response.text.should.eql('NOT_FOUND');
                done();
            })
    });

    it('Should respond with the shopping list if the ids are valid and match is found', (done) => {
        chai.request(server)
            .get('/recipes/shopping-list?ids=1')
            .then(response => {
                response.status.should.eql(200);
                response.body.should.eql(recipes[0].ingredients);
                done();
            })
    })

    it('Should respond with the correct shopping if the query sent is mixed', (done) => {
        chai.request(server)
            .get('/recipes/shopping-list?ids=1,2')
            .then(response => {
                response.status.should.eql(200);
                response.body.should.eql([...recipes[0].ingredients, ...recipes[2].ingredients]);
                done();
            })
    })

});
