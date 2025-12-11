import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Producto } from '../model.ts/producto.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
 // URL base del backend para las rutas del carrito.
  private apiUrl = 'http://localhost/api_proyecto/public/carrito';

  // BehaviorSubject almacena el estado actual del carrito de forma reactiva.
  // Cualquier componente suscrito se actualiza automáticamente cuando cambia.
  private carritoSubject = new BehaviorSubject<any[]>([]);

  // Observable público para que otros componentes se suscriban.
  carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------------------
  // Agrega token del usuario a los headers para todas las peticiones.
  // -------------------------------------------------------------------
  private getHeaders() {
    const token = localStorage.getItem('token') ?? '';

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // ===============================================================
  // OBTENER CARRITO DESDE LA API
  // ===============================================================
  obtenerCarrito(): Observable<any[]> {
    // Llama al endpoint GET /carrito
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  // ===============================================================
  // CARGA INICIAL DEL CARRITO AL INICIAR LA APP O EL NAV
  // ===============================================================
  cargarCarrito(): void {
    this.obtenerCarrito().subscribe({
      next: items => {
        // Actualiza el observable con los items recibidos.
        this.carritoSubject.next(items);
      },
      error: () => {
        // Si falla, se vacía para evitar inconsistencias.
        this.carritoSubject.next([]);
      }
    });
  }

  // ===============================================================
  // PERMITE FORZAR EL CAMBIO DEL CARRITO DESDE AFUERA
  // ===============================================================
  setCarrito(items: any[]) {
    this.carritoSubject.next(items);
  }

  // ===============================================================
  // AGREGAR PRODUCTO AL CARRITO
  // ===============================================================
agregarAlCarrito(producto: Producto) {
  const body = {
    id_producto: producto.id,
    cantidad: 1,
    precio_unitario: producto.precio
  };

  return this.http.post(`${this.apiUrl}/agregar`, body, this.getHeaders());
}



  // ===============================================================
  // ACTUALIZAR CANTIDAD DE UN ÍTEM DEL CARRITO
  // ===============================================================
  actualizarCantidad(idDetalleCarrito: number, cantidad: number): Observable<any> {

    // PUT /carrito/actualizar/:id
    return this.http.put<any>(
      `${this.apiUrl}/actualizar/${idDetalleCarrito}`,
      { cantidad },
      this.getHeaders()
    ).pipe(
      tap((r: any) => {
        // Si viene carrito actualizado, lo enviamos al observable global.
        if (r?.carrito) {
          this.carritoSubject.next(r.carrito);
        }
      })
    );
  }

  // ===============================================================
  // ELIMINAR PRODUCTO DEL CARRITO
  // ===============================================================
  eliminarProducto(idDetalleCarrito: number): Observable<any> {

    // DELETE /carrito/eliminar/:id
    return this.http.delete<any>(
      `${this.apiUrl}/eliminar/${idDetalleCarrito}`,
      this.getHeaders()
    ).pipe(
      tap((r: any) => {
        // Actualización reactiva del estado del carrito.
        if (r?.carrito) {
          this.carritoSubject.next(r.carrito);
        }
      })
    );
  }

  // ===============================================================
  // VACIAR TODO EL CARRITO
  // ===============================================================
  vaciarCarrito(): Observable<any> {

    // DELETE /carrito/vaciar
    return this.http.delete<any>(
      `${this.apiUrl}/vaciar`,
      this.getHeaders()
    ).pipe(
      tap(() => {
        // Vacía el carrito global.
        this.carritoSubject.next([]);
      })
    );
  }
    obtenerTotal(): number{
    const productos =  this.carritoSubject.getValue();
    //Usamos reduce para sumar los subtotales de cada producto
    return productos.reduce((total,item)=> total + item.producto.precio*item.cantidad, 0)
  }
obtenerProductos():{producto:Producto;cantidad:number}[]{
    return this.carritoSubject.getValue();
  }
}


  /*
  /// Creamos un BehaviorSubject que representa el estado actual del carrito de compras.
// Guarda un array de objetos, donde cada objeto tiene un producto y su cantidad.
// El valor inicial es un array vacío. Al ser un BehaviorSubject, cualquier cambio en el carrito
// se puede emitir y observar desde otros componentes o servicios que se suscriban a este observable
  private carritoSubject = new BehaviorSubject <{ producto: Producto; cantidad: number}[]>([]);
  carrito$ = this.carritoSubject.asObservable();
  agregarAlCarrito(producto: Producto){
    const productos = this.carritoSubject.getValue();
    const encontrado = productos.find(p => p.producto.id === producto.id);
    if(encontrado){
      encontrado.cantidad++;
    }else{
      this.carritoSubject.next([...productos, {producto, cantidad:1}])
    }
  }
  eliminarDelCarrito(productoId:number){
    const productos = this.carritoSubject.getValue().filter(p => p.producto.id !== productoId)
    this.carritoSubject.next(productos)
  }

  vaciarCarrito(){
    this.carritoSubject.next([])
  }

  //Metodo para actualizar la cantidad de un producto en el carrito
  actualizarCantidad(productoId: number,nuevaCantidad:number){
    //Recorremos el carrito y actualizamos la cantidad del producto con el ID dado
    const productos = this.carritoSubject.getValue().map(item => {
      if(item.producto.id === productoId){
        //Retornamos una copia del producto con la nueva cantidad
        return{...item,cantidad:nuevaCantidad};
      }
      return item;
    })
    
    //Emitimos el nuevo estado del carrito
    this.carritoSubject.next(productos)
  }

  //Metodo para obtener los productos del carrito con un arreglo
  obtenerProductos():{producto:Producto;cantidad:number}[]{
    return this.carritoSubject.getValue();
  }

  //Metodo para calcular el total a pagar (precio*cantidad de cada producto)
  obtenerTotal(): number{
    const productos =  this.carritoSubject.getValue();
    //Usamos reduce para sumar los subtotales de cada producto
    return productos.reduce((total,item)=> total + item.producto.precio*item.cantidad, 0)
  }


  constructor() { }
}
  */