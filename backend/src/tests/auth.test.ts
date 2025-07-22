import request from 'supertest';
import app from '../server'; // استيراد تطبيق Express الرئيسي
import { StatusCodes } from 'http-status-codes';

describe('Authentication API', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

   
  describe('POST /api/v1/auth/register', () => {
    it('should register a user successfully with valid data', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(StatusCodes.CREATED);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.name).toBe(testUser.name);
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should fail to register a user with an existing email', async () => {
      // تسجيل المستخدم أولاً
      await request(app).post('/api/v1/auth/register').send(testUser);

      // محاولة التسجيل مرة أخرى بنفس الإيميل
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(StatusCodes.CONFLICT);
      expect(res.body.message).toBe('User with this email already exists');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    // تسجيل المستخدم قبل كل اختبار في هذا القسم
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send(testUser);
    });

    it('should log in a registered user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toEqual(StatusCodes.OK);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail to log in with an incorrect password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });
      
      expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });
  });
});