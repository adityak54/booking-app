    import mongoose from 'mongoose';
    import bcrypt from 'bcrypt'
    export type UserType = {
        _id: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string
    };
    const userSchema = new mongoose.Schema({
        email:{type:String, required:true, unique:true},
        password:{type:String, required:true},
        firstName:{type:String, required:true},
        lastName:{type:String, required:true},

    });

    // hashing password
    // userSchema.pre('save', ...) registers a middleware function to be executed before a document is saved.
    userSchema.pre("save",async function(next){
        if (!this.isModified('password')) {
            return next();
        }
        try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(this.password,salt);
            this.password = hashPassword;
        } catch (error) {
            console.log(error);
            return next();
        }
    })

    const User = mongoose.model<UserType>('User',userSchema);
    export default User