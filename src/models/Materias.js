import {Schema, model} from "mongoose";

const materiasSchema = new Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    codigo:{
        type:String,
        require:true,
        trim:true
    },
    descripcion:{
        type:String,
        require:true,
        trim:true
    },
    creditos:{
        type:String,
        require:true,
        trim:true
    },
},{
    timestamps: true
})

export default model('Materias', materiasSchema)



