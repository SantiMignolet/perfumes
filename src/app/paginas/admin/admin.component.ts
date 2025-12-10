import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService } from '../../servicio/product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  productos: any[] = [];
  formulario!: FormGroup;
  editando = false;
  productoActual: any = null;

  imagenPrevia: string | null = null;
  archivoImagen: File | null = null;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarProductos();
  }

  crearFormulario() {
  this.formulario = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    stock: [0, Validators.required],
    categoria: ['productos', Validators.required],  
    imagen: ['']
  });
}


  cargarProductos() {
    this.productService.obtenerProductos().subscribe({
      next: (res) => this.productos = res,
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.archivoImagen = file;

    const reader = new FileReader();
    reader.onload = () => (this.imagenPrevia = reader.result as string);
    reader.readAsDataURL(file);
  }

  guardar() {
    const formData = new FormData();
    formData.append("nombre", this.formulario.value.nombre);
    formData.append("descripcion", this.formulario.value.descripcion);
    formData.append("precio", this.formulario.value.precio);
    formData.append("stock", this.formulario.value.stock);
    formData.append("categoria", this.formulario.value.categoria); // OK

    if (this.archivoImagen) {
      formData.append("imagen", this.archivoImagen);
    }

    if (this.editando) {
      this.productService.actualizarProducto(this.productoActual.id, formData).subscribe({
        next: () => {
          alert("Producto actualizado");
          this.reset();
          this.cargarProductos();
        },
        error: (err) => console.error("Error actualizando producto", err)
      });

    } else {
      this.productService.crearProducto(formData).subscribe({
        next: () => {
          alert("Producto creado");
          this.reset();
          this.cargarProductos();
        },
        error: () => alert("Error al crear producto")
      });
    }
  }

  editar(producto: any) {
    this.editando = true;
    this.productoActual = producto;

    this.formulario.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria // OK
    });

    this.imagenPrevia = producto.imagen
      ? `http://localhost/api_proyecto/public/uploads/${producto.imagen}`
      : null;
  }

  eliminar(id: number) {
    if (!confirm("¿Seguro de eliminar este producto?")) return;

    this.productService.eliminarProducto(id).subscribe({
      next: () => {
        alert("Producto eliminado");
        this.cargarProductos();
      },
      error: () => alert("Error eliminando producto")
    });
  }

  reset() {
    this.formulario.reset({
      categoria: "productos"
    });
    this.editando = false;
    this.productoActual = null;
    this.imagenPrevia = null;
    this.archivoImagen = null;
  }
}
