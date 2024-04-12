const { ObjectId } = require("mongodb");

class ReaderService {
    constructor(client) {
        this.reader = client.db().collection("docgia");
    }
    
    extractReaderData(payload) {
        const reader = {
            MADOCGIA: payload.MADOCGIA,
            USERNAME: payload.USERNAME,
            PASSWORD: payload.PASSWORD,
            HOLOT: payload.HOLOT,
            TEN: payload.TEN,
            NGAYSINH: payload.NGAYSINH,
            PHAI: payload.PHAI,
            DIACHI: payload.DIACHI,
            DIENTHOAI: payload.DIENTHOAI
        };

        // Remove undefined fields
        Object.keys(reader).forEach(
            (key) => reader[key] === undefined && delete reader[key]
        );
        return reader;
    }

    generateID() {
        const chars = '0123456789';
        let result = '';
        for (let i = 0; i < 2; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async find(filter){
        const cursor = await this.reader.find(filter);
        return await cursor.toArray();
    }

    async findById(id){
        return await this.reader.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findByMADOCGIA(MADOCGIA) {
        const filter = { MADOCGIA: MADOCGIA };
        const cursor = await this.reader.find(filter);
        return await cursor.toArray();
    }

    async update(id,payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractReaderData(payload);
        const result = await this.reader.findOneAndUpdate(
            filter,
            { $set: update},
            { returnDocument: "after" }
        );
        return result;
    }

      async delete(id){
        const result = await this.reader.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll(){
        const result = await this.reader.deleteMany({});
        return result.deletedCount;
    }

    async register(payload) {
        const { USERNAME, PASSWORD } = payload;

        const existingUser = await this.reader.findOne({ USERNAME });
        if (existingUser) {
            throw new Error("Username already exists");
        }

        const newUser = { ...payload };
        delete newUser._id; 
        newUser.MADOCGIA = this.generateID();
        const result = await this.reader.insertOne(newUser);
        return result;
    }


    async login(username, password) {
        const user = await this.reader.findOne({ USERNAME: username });
        if (!user) {
            throw new Error("User not found");
        }

        if (user.PASSWORD !== password) {
            throw new Error("Incorrect password");
        }

	const { MADOCGIA } = user; // Lấy MADOCGIA từ user
    	return { MADOCGIA };
    }
}

module.exports = ReaderService;
