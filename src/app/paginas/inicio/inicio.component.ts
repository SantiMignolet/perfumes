import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../servicio/product.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../servicio/carrito.service';
import { FavoritosService } from '../../servicio/favoritos.service';
import { Producto } from '../../model.ts/producto.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  masbuscados: Producto[] = [];

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    this.cargarBuscados();
  }

  cargarBuscados() {
    this.productService.getMasbuscados().subscribe((productos: any[]) => {
      this.masbuscados = productos.filter(p => p.categoria === 'masbuscados');
    });
  }

  // --- AGREGAR AL CARRITO ---
  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarAlCarrito(producto).subscribe({
      next: (resp) => console.log('Agregado al carrito', resp),
      error: (err) => console.error(err)
    });
  }

  // --- AGREGAR A FAVORITOS ---
  agregarAFavoritos(producto: Producto) {
    this.favoritosService.agregarFavorito(producto).subscribe({
      next: () => console.log('Agregado a favoritos'),
      error: (err) => console.error(err)
    });
  }
}
