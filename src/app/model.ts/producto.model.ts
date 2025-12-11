export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;

  // Opcionales
  categoria?: string;
  marca?: string;
  disponibilidad?: boolean;
  cantidad?: number;
}
