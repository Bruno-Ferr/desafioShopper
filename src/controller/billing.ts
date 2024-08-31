import { Request, Response } from "express";
import knex from "knex";
import { db } from "../database/connection";
import { Teste } from "../IA/gemini";
import { v4 } from 'uuid';
import { z } from "zod";
const { development, production } = require('../../knexfile')

type bodyProps = {
  "image": string
  "customer_code": string,
  "measure_datetime": Date,
  "measure_type": "WATER" | "GAS"
}

export async function upload(req: Request, res: Response) {
  const data: bodyProps = req.body;

  const date = new Date(data.measure_datetime);
  const year = (date.getFullYear()).toString(); //convert para ano
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); //convert para mês

  const user = await db('measures').select().where('customer_id', data.customer_code).andWhere('measure_type', (data.measure_type).toUpperCase())
    .whereRaw(`strftime('%Y', datetime(date / 1000, 'unixepoch')) = ?`, [year]).andWhereRaw(`strftime('%m', datetime(date / 1000, 'unixepoch')) = ?`, [month])

  if(user.length > 0) {
    return res.status(409).json({"error_code": "DOUBLE_REPORT","error_description": "Leitura do mês já realizada"})
  }

  const value = await Teste(data.image)
  
  if(value == "Invalid image.") {
    return res.status(400).json({
      "error_code": "INVALID_DATA",
      "error_description": "Os dados fornecidos no corpo da requisição são inválidos"
     })
  }

  const saveInDB = {
    id: v4(), 
    'customer_id': data.customer_code, 
    'measure_type': (data.measure_type).toUpperCase(), 
    date: new Date()
  }

  await db('measures').insert(saveInDB)

  return res.status(200).json({image_url: 'fake', measure_value: Number(value), measure_uuid: saveInDB.id})
} 

export async function confirmValues(req: Request, res: Response) {
  const body = req.body;

  const valid = z.object({
    measure_uuid: z.string(),
    confirmed_value: z.number(),
  }).required()

  const {data, success} = valid.safeParse(body)
  
  if(!success) {
    return res.status(400).json({
      "error_code": "MEASURE_NOT_FOUND",
      "error_description": "Os dados fornecidos no corpo da requisição são inválidos"
    })
  }

  const [measure] = await db('measures').select().where('id', data.measure_uuid)
  console.log(!undefined)
  if(!measure) {
    return res.status(404).json({
      "error_code": "MEASURE_NOT_FOUND",
      "error_description": "Leitura do mês já realizada"
    })
  }

  if(measure.has_confirmed) {
    return res.status(409).json({
      "error_code": "CONFIRMATION_DUPLICATE",
      "error_description": "Leitura do mês já realizada"
    })
  }

  //Salvar o novo valor
  await db('measures').update({value: data.confirmed_value, has_confirmed: true})
  return res.status(200).json({success: true})
}

export async function list(req: Request, res: Response) {
  const {customer_id} = req.params;
  const query = req.query; 
  
  //verificar se o query é WATER ou GAS, caso seja diferente erro. Caso não tenha query procurar sem query
  
  const response = await db('measures').select().where('customer_id', customer_id)

  if (response.length < 1) {
    return res.status(404).json({
      "error_code": "MEASURES_NOT_FOUND",
      "error_description": "Nenhuma leitura encontrada"
    })
  }

  return res.status(200).json({customer_code: customer_id, measures: response})
}