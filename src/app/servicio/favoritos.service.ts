 import { Injectable } from '@angular/core';
import { Producto } from '../model.ts/producto.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private apiUrl = 'http://localhost/api_proyecto/public/favoritos';

  // 🔥 ESTE SUBJECT ES LO QUE NECESITÁS PARA QUE ANDE "des$"
  private favoritosSubject = new BehaviorSubject<any[]>([]);
  des$ = this.favoritosSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = (typeof localStorage !== 'undefined')
      ? localStorage.getItem('token') || ''
      : '';

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ===================================================
  // CARGAR FAVORITOS Y EMITIR LOS DATOS
  // ===================================================
  obtenerFavoritos() {
    this.http.get<any[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).subscribe((data) => {
      this.favoritosSubject.next(data); // 🔥 Emite los favoritos
    });
  }

  // ===================================================
  // AGREGAR FAVORITO (y refrescar lista)
  // ===================================================
agregarFavorito(producto: any) {
  const body = { id_producto: producto.id };

  return this.http.post(
    `${this.apiUrl}/agregar`,
    body,
    { headers: this.getAuthHeaders() }
  );
}
  // ===================================================
  // ELIMINAR FAVORITO (y refrescar lista)
  // ===================================================
  eliminarFavorito(idProducto: number) {
    this.http.delete(
      `${this.apiUrl}/eliminar/${idProducto}`,
      { headers: this.getAuthHeaders() }
    ).subscribe(() => {
      this.obtenerFavoritos(); // 🔥 Recarga y emite
    });
  }
}


  /*
 private favoritosSubject = new BehaviorSubject<{producto:Producto; cantidad: number}[]>([])
 des$ = this.favoritosSubject.asObservable()
 
 agregarAfavoritos(producto:Producto){
  const productos = this.favoritosSubject.getValue()
  const encontrado = productos.find(p => p.producto.id === producto.id)

  if(encontrado){
    encontrado.cantidad++
  }else{
    this.favoritosSubject.next ([...productos,{producto,cantidad:1}])
  }
 }

 eliminarDeFavoritos(productoId:number){
  const productos = this.favoritosSubject.getValue().filter(p => p.producto.id !== productoId)
  this.favoritosSubject.next(productos)
 }
 constructor(){}
 

}
 */
