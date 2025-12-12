import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../servicio/product.service';
import { CarritoService } from '../../servicio/carrito.service';
import { FavoritosService } from '../../servicio/favoritos.service'; // <- correcto
import { Producto } from '../../model.ts/producto.model';

@Component({
  selector: 'app-novedades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent implements OnInit {

  novedades: Producto[] = [];

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    this.cargarNovedades();
  }

  cargarNovedades() {
    this.productService.getNovedades().subscribe((productos: any[]) => {
      this.novedades = productos.filter(p => p.categoria === 'novedades');
    });
  }

  // -------------------------------------------------------
  // AGREGAR AL CARRITO (usa tu servicio real)
  // -------------------------------------------------------
  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarAlCarrito(producto).subscribe({
      next: (resp) => console.log('Agregado al carrito', resp),
      error: (err) => console.error(err)
    });
  }

  // -------------------------------------------------------
  // AGREGAR A FAVORITOS (usa BehaviorSubject)
  // -------------------------------------------------------
  agregarAFavoritos(producto: Producto) {
    this.favoritosService.agregarFavorito(producto).subscribe({
      next: () => console.log('Agregado a favoritos'),
      error: (err) => console.error(err)
    });
  }
}
