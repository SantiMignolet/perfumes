import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Producto } from '../model.ts/producto.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private apiUrl = 'http://localhost/api_proyecto/public/carrito';

  private carritoSubject = new BehaviorSubject<any[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token') ?? '';

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  obtenerCarrito(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  cargarCarrito(): void {
    this.obtenerCarrito().subscribe({
      next: items => {
        this.carritoSubject.next(items);
      },
      error: () => {
        this.carritoSubject.next([]);
      }
    });
  }

  setCarrito(items: any[]) {
    this.carritoSubject.next(items);
  }

  agregarAlCarrito(producto: Producto) {
    const body = {
      id_producto: producto.id,
      cantidad: 1,
      precio_unitario: producto.precio
    };

    return this.http.post(`${this.apiUrl}/agregar`, body, this.getHeaders());
  }

  actualizarCantidad(idDetalleCarrito: number, cantidad: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/actualizar/${idDetalleCarrito}`,
      { cantidad },
      this.getHeaders()
    ).pipe(
      tap((r: any) => {
        if (r?.carrito) {
          this.carritoSubject.next(r.carrito);
        }
      })
    );
  }

  eliminarProducto(idDetalleCarrito: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/eliminar/${idDetalleCarrito}`,
      this.getHeaders()
    ).pipe(
      tap((r: any) => {
        if (r?.carrito) {
          this.carritoSubject.next(r.carrito);
        }
      })
    );
  }

  vaciarCarrito(): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/vaciar`,
      this.getHeaders()
    ).pipe(
      tap(() => {
        this.carritoSubject.next([]);
      })
    );
  }

  // 🔥🔥🔥 NUEVO MÉTODO PARA FINALIZAR COMPRA
  procesarCompra(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/comprar`,
      {},
      this.getHeaders()
    );
  }

  obtenerTotal(): number {
    const productos = this.carritoSubject.getValue();
    return productos.reduce((total, item) => total + item.producto.precio * item.cantidad, 0)
  }

  obtenerProductos(): { producto: Producto; cantidad: number }[] {
    return this.carritoSubject.getValue();
  }
}

