const { ObjectId } = require("mongodb");

class BorrowBookService {
    constructor(client) {
        this.borrowBook = client.db().collection("theodoimuonsach");
    }
    
    extractBorrowBookData(payload) {
        const borrowBook = {
            MADOCGIA: payload.MADOCGIA,
            MASACH: payload.MASACH,
	        GHICHU: payload.GHICHU,
            NGAYMUON: payload.NGAYMUON,
            NGAYTRA: payload.NGAYTRA
        };

        // Remove undefined fields
        Object.keys(borrowBook).forEach(
            (key) => borrowBook[key] === undefined && delete borrowBook[key]
        );
        return borrowBook;
    }

    generateID() {
        const chars = '0123456789';
        let result = '';
        for (let i = 0; i < 2; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async create(payload) {
        const borrowBook = this.extractBorrowBookData(payload);
        const result = await this.borrowBook.findOneAndUpdate(
            borrowBook,
            { $set: borrowBook },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter){
        const cursor = await this.borrowBook.find(filter);
        return await cursor.toArray();
    }

    async findById(id){
        return await this.borrowBook.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findByMADOCGIA(MADOCGIA) {
        const filter = { MADOCGIA: MADOCGIA };
        const cursor = await this.borrowBook.find(filter);
        return await cursor.toArray();
    }

    async findByMASACH(MASACH) {
        const filter = { MASACH: MASACH };
        const cursor = await this.borrowBook.find(filter);
        return await cursor.toArray();
    }

    async update(id,payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractBorrowBookData(payload);
        const result = await this.borrowBook.findOneAndUpdate(
            filter,
            { $set: update},
            { returnDocument: "after" }
        );
        return result;
    }

      async delete(id){
        const result = await this.borrowBook.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll(){
        const result = await this.borrowBook.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = BorrowBookService;
