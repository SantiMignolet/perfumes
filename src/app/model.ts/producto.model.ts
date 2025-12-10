export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;            // agregado
  disponibilidad?: boolean; //  calculada desde stock
  cantidad?: number;  
  categoria:string, 
  marca:string     //  carrito
}
