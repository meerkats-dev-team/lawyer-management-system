module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/tests/**/*.test.ts'], // يحدد مكان ملفات الاختبار
  verbose: true,
  forceExit: true, // يضمن إغلاق Jest بعد انتهاء الاختبارات
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  // يحدد ملف الإعداد الذي سيتم تشغيله قبل بدء الاختبارات
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'], 
};