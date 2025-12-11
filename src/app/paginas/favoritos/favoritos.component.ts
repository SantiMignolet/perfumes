import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FavoritosService } from '../../servicio/favoritos.service';
import { Producto } from '../../model.ts/producto.model';

@Component({
  selector: 'app-favoritos',
  imports: [NgFor,NgIf],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent implements OnInit {

  productosEnFavoritos: { producto: Producto; cantidad: number }[] = []

  constructor(private favoritosService: FavoritosService) { }

  ngOnInit(): void {
    this.favoritosService.favoritos$.subscribe((productos) => {

      // Construye la URL completa de la imagen
      this.productosEnFavoritos = productos.map(item => ({
        ...item,
        producto: {
          ...item.producto,
          imagen: item.producto.imagen
            ? `http://localhost/api_proyecto/public/uploads/${item.producto.imagen}`
            : 'assets/sin-imagen.png'
        }
      }));

    });
  }


  eliminarProducto(productoId: number) {
    this.favoritosService.eliminarDeFavoritos(productoId)

  }


}