export const jwtConstants = {
  secret: 'ZApp',
};

export const jwtTokenConfigs = {
  global: true,
  secret: jwtConstants.secret,
  signOptions: { expiresIn: '5m' },
};
