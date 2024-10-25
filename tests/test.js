const request = require('supertest');
const app = require('../app'); // Ensure 'app' exports your Express app
let authToken;
let userId;
describe('Auth Routes', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'testtuser',email:"testte@example.com", password: 'testpass', role: "admin" });
        expect(res.statusCode).toEqual(400||201);

    });

    it('should log in a user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testtuser', password: 'testpass' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');

        authToken = res.body.token;

        console.log(authToken);
        console.log(`A, ${authToken}`);
        userId = res.body.user._id;
        console.log(userId);

    });
});
let product_id;
describe('Product Routes', () => {
    it('should create a product', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({ name: 'New Product', price: 100 })
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'New Product');
        product_id = res.body._id;
        console.log(product_id);
    });

    it('should get all products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});
describe('Cart Routes', () => {
    it('should add item to cart', async () => {
        const res = await request(app)
            .post(`/api/cart/${userId}/items`)
            .send({ _id: `${product_id}`, quantity: 2 });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('items');
    });

    it('should retrieve cart by userId', async () => {
        const res = await request(app)
            .get(`/api/cart/${userId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('items');
    });
});
let id_o;


describe('Order Routes', () => {
    it('should create an order for a user', async () => {
        const res = await request(app)
            .post(`/api/order/order/${userId}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'completed');
         id_o= res.body._id;
         console.log(id_o)
    });

    it('should retrieve order by orderId', async () => {
        const res = await request(app)
            .get(`/api/order/order/${id_o}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('cart');
    });
});



describe('User Routes', () => {
    it('should update user details', async () => {
        const res = await request(app)
            .patch('/api/user/me')
            .send({ username: 'updatedUser' })
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('username', 'updatedUser');
    });

    it('should update user details', async () => {
        const res = await request(app)
            .patch('/api/user/me')
            .send({ username: 'testtuser' })
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('username', 'testtuser');
    });
});