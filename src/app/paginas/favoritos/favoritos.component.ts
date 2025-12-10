// favoritos.component.ts
import { Component, OnInit } from '@angular/core';

import { Producto } from '../../model.ts/producto.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FavoritosService } from '../../servicio/favoritos.service';
import { CarritoService } from '../../servicio/carrito.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
})
export class FavoritosComponent implements OnInit {
productosFavoritos: {producto: Producto; cantidad: number}[] = []

ngOnInit(): void {
  this.favoritosService.des$.subscribe((productos) => {
    this.productosFavoritos = productos
  })
}
  eliminarFavorito(productoId:number){
    this.favoritosService.eliminarFavorito(productoId)
  }

  constructor(
  private favoritosService: FavoritosService,
  private carritoService: CarritoService
) {}

agregarProductoCarrito(producto: Producto) {
  this.carritoService.agregarAlCarrito(producto);
}
}