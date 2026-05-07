export const jwtConfig = {
  secret: process.env.JWT_SECRET || "cadmax_secret_key",
  expiresIn: process.env.JWT_EXPIRE || "7d",
};
