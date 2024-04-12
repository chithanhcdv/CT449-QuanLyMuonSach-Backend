const { ObjectId } = require("mongodb");

class StaffService {
    constructor(client) {
        this.staff = client.db().collection("nhanvien");
    }
    
    extractStaffData(payload) {
        const staff = {
            MSNV: payload.MSNV,
            HOTENNV: payload.HOTENNV,
            USERNAME: payload.USERNAME,
            PASSWORD: payload.PASSWORD,
            CHUCVU: payload.CHUCVU,
            DIACHI: payload.DIACHI,
            SODIENTHOAI: payload.SODIENTHOAI
        };

        // Remove undefined fields
        Object.keys(staff).forEach(
            (key) => staff[key] === undefined && delete staff[key]
        );
        return staff;
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
        const { USERNAME, PASSWORD } = payload;

        const existingStaff = await this.staff.findOne({ USERNAME });
        if (existingStaff) {
            throw new Error("Username already exists");
        }

        const newStaff = { ...payload };
        delete newStaff._id; 

        const staff = this.extractStaffData(payload);
        newStaff.MSNV = this.generateID();
        const result = await this.staff.findOneAndUpdate(
            staff,
            { $set: newStaff },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter){
        const cursor = await this.staff.find(filter);
        return await cursor.toArray();
    }

    async findById(id){
        return await this.staff.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

     async findByMSNV(MSNV) {
        const filter = { MSNV: MSNV };
        const cursor = await this.staff.find(filter);
        return await cursor.toArray();
    }

    async update(id,payload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractStaffData(payload);
        const result = await this.staff.findOneAndUpdate(
            filter,
            { $set: update},
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id){
        const result = await this.staff.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll(){
        const result = await this.staff.deleteMany({});
        return result.deletedCount;
    }

    async register(payload) {
        const { USERNAME, PASSWORD } = payload;

        const existingUser = await this.staff.findOne({ USERNAME });
        if (existingUser) {
            throw new Error("Username already exists");
        }

        const newUser = { ...payload };
        delete newUser._id; 

        const result = await this.staff.insertOne(newUser);
        return result;
    }

    async login(username, password) {
        const user = await this.staff.findOne({ USERNAME: username });
        if (!user) {
            throw new Error("User not found");
        }

        if (user.PASSWORD !== password) {
            throw new Error("Incorrect password");
        }

        return user;
    }
}

module.exports = StaffService;
