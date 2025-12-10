export interface Ofertas{
    id:number;
    nombre:string;
    descripcion:string;
    anterior:number;
    precio:number;
    imagen:string;
    disponibilidad:boolean;
    categoria:string,
    cantidad?:number,
    marca:string
}