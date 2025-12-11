import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../servicio/product.service';
import { CommonModule } from '@angular/common';
import { Producto } from '../../model.ts/producto.model';
import { FavoritosService } from '../../servicio/favoritos.service';
import { CarritoService } from '../../servicio/carrito.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {


  productos: any[] = [];
  categoria: string | null = null;
  valor: string | null = null;

  constructor(private productService: ProductService,

    // Servicio responsable de agregar productos al carrito y manejar su estado.
    private carritoService: CarritoService,

    // Servicio encargado de gestionar los productos favoritos del usuario.
    private favoritoService: FavoritosService,
    private route: ActivatedRoute) { }





  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoria = params['categoria'] || null;
      this.valor = params['valor'] || null;
      this.cargarProductos();
    });
  }

  cargarProductos() {
    this.productService.obtenerProductos().subscribe((res: any[]) => {
      if (this.categoria && this.valor) {
        this.productos = res.filter(p => p[this.categoria!] === this.valor);
      } else {
        this.productos = res;
      }
    });
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarAlCarrito(producto).subscribe({
      next: () => console.log('Producto agregado'),
      error: err => console.error(err)
    });
  }

  // Agrega un producto a la lista de favoritos del usuario.
  agregarAFavoritos(producto: Producto): void {
    this.favoritoService.agregarFavorito(producto).subscribe({
      next: () => console.log('Agregado'),
      error: (err) => console.error(err)
    });
  }
}