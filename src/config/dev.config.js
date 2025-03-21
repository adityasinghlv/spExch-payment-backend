console.log(process.env.DB_URL, "-----------------")
module.exports = {
    JWT_KEY: process.env.JWT_KEY,
    EMAIL_CONFIG: {
        host: process.env.smshost,
        port: process.env.smsport,
        username: process.env.mail_username,
        password: process.env.password,
        from_name: process.env.from_name,
        from_address: process.env.from_address
    },
    PORT: process.env.PORT || 6262,
    HOST: process.env.HOST || '0.0.0.0',
    DB_URL: process.env.DB_URL,
    TOKEN_EXP: process.env.TOKEN_EXP,
    PER_PAGE: process.env.PER_PAGE || 10,
    IP_URL: process.env.IP_URL,
    REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
    REDIS_PORT: "",
    xArcherKey: process.env.xArcherKey,
    API_URL: process.env.API_URL
};
