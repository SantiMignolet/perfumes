import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../servicio/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  categoria: string | null = null;
  valor: string | null = null;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) {}

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

  agregarAlCarrito(producto: any) {
    console.log('Agregar al carrito', producto);
  }

  agregarAFavoritos(producto: any) {
    console.log('Agregar a favoritos', producto);
  }
}
