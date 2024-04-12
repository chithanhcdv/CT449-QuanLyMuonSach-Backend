const { ObjectId } = require("mongodb");

class PublisherService {
    constructor(client) {
        this.publisher = client.db().collection("nhaxuatban");
    }
    
    extractPublisherData(payload) {
        const publisher = {
            MANXB: payload.MANXB,
            TENNXB: payload.TENNXB,
            DIACHI: payload.DIACHI,
        };

        // Remove undefined fields
        Object.keys(publisher).forEach(
            (key) => publisher[key] === undefined && delete publisher[key]
        );
        return publisher;
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
        const existingPublisher = await this.publisher.findOne(this.extractPublisherData(payload));
        if (existingPublisher) {
            return existingPublisher;
        }
        
        const publisher = this.extractPublisherData(payload);
        publisher.MANXB = this.generateID();
        const result = await this.publisher.findOneAndUpdate(
            publisher,
            { $set: publisher },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter){
        const cursor = await this.publisher.find(filter);
        return await cursor.toArray();
    }

    async findByName(name){
        return await this.find({
            TENNXB: { $regex: new RegExp(name), $options: "i"},
        });
    }

    async findById(id){
        return await this.publisher.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findByMANXB(MANXB) {
        const filter = { MANXB: MANXB };
        const cursor = await this.publisher.find(filter);
        return await cursor.toArray();
    }

    async update(id,payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractPublisherData(payload);
        const result = await this.publisher.findOneAndUpdate(
            filter,
            { $set: update},
            { returnDocument: "after" }
        );
        return result;
    }

      async delete(id){
        const result = await this.publisher.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll(){
        const result = await this.publisher.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = PublisherService;
