// In an actual project, we would not hardcode the test user credentials in the codebase.
// Instead, we would use a local test database, this is discussed further in the documentation.

const testUserUUID = '2ad611c8-6d40-4f55-b131-bc2ab7938cb5';
const testUserSecret = 'fa93a6b9ba92905404685b0ed460628b588a0f0697f9b47dc94a56504c84899b';

export const getTestUserUUID = () => testUserUUID;
export const getTestUserSecret = () => testUserSecret;
