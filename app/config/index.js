const config = {
    app: {
        port: process.env.PORT || 3000 // Sử dụng biến môi trường PORT nếu có, nếu không sử dụng cổng 3000 mặc định
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Quanlymuonsach"
    }
};

module.exports = config;