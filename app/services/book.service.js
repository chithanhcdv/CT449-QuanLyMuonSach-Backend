const { ObjectId } = require("mongodb");

class BookService {
    constructor(client) {
        this.book = client.db().collection("sach");
    }
    
    extractBookData(payload) {
        const book = {
            MASACH: payload.MASACH,
            TENSACH: payload.TENSACH,
            DONGIA: payload.DONGIA,
            SOQUYEN: payload.SOQUYEN,
            NAMXUATBAN: payload.NAMXUATBAN,
            MANXB: payload.MANXB,
            TACGIA: payload.TACGIA
        };

        // Remove undefined fields
        Object.keys(book).forEach(
            (key) => book[key] === undefined && delete book[key]
        );
        return book;
    }

    generateID() {
        const chars = '0123456789';
        let result = '';
        for (let i = 0; i < 3; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async create(payload) {
        const existingBook = await this.book.findOne(this.extractBookData(payload));
        if (existingBook) {
            return existingBook;
        }

        const book = this.extractBookData(payload);
        book.MASACH = this.generateID();
        const result = await this.book.findOneAndUpdate(
            book,
            { $set: book },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }


    async find(filter){
        const cursor = await this.book.find(filter);
        return await cursor.toArray();
    }

    async findByName(name){
        return await this.find({
            TENSACH: { $regex: new RegExp(name), $options: "i"},
        });
    }

    async findById(id){
        return await this.book.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id,payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractBookData(payload);
        const result = await this.book.findOneAndUpdate(
            filter,
            { $set: update},
            { returnDocument: "after" }
        );
        return result;
    }

      async delete(id){
        const result = await this.book.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll(){
        const result = await this.book.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = BookService;
