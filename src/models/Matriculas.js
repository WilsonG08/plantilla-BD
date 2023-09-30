import mongoose, { Schema, model } from "mongoose";

const matriculasSchema = new Schema({
    usuario:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Usuarios'
    },
    descripccion:{
        type:String,
        require:true,
        trim:true
    },
    id_estudiantes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Estudiantes'
    },
    id_materia:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Materias'
    },
},{
    timestamps: true
})

export default model ('Matriculas', matriculasSchema)
