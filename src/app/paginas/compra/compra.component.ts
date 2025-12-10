import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import { CarritoService } from '../../servicio/carrito.service';
import { CompraService } from '../../servicio/compra.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-compra',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent implements OnInit {
// Lista de productos presentes en el carrito al momento de finalizar la compra.
  productos: any[] = [];

  // Datos adicionales que el usuario debe completar (pueden usarse más adelante en el futuro).
  datos = { direccion: '', telefono: '' };

  // Valores monetarios usados durante el resumen de compra.
  subtotal = 0;
  envio = 1000; // Costo fijo de envío.
  total = 0;

  // Mensajes informativos para el usuario (éxito o error).
  mensaje = '';

  // Indica si se está procesando la compra para evitar doble envío.
  cargando = false;

  constructor(
    // Servicio que administra los datos del carrito (observable reactivo carrito$).
    private carritoService: CarritoService,

    // Servicio encargado de comunicarse con el backend para registrar la compra.
    private compraService: CompraService,

    // Router para navegar hacia el ticket luego de realizar la compra.
    private router: Router
  ) {}

  // Se ejecuta al iniciar el componente.
  ngOnInit(): void {

    // Se suscribe al carrito en tiempo real:
    // si se modifica el carrito en cualquier parte de la app,
    // este componente vuelve a calcular los totales.
    this.carritoService.carrito$.subscribe(items => {
      this.productos = items;
      this.calcularTotales();
    });
  }

  // Calcula subtotal, envío y total final.
  calcularTotales() {

    // Toma cada producto y multiplica precio_unitario * cantidad.
    this.subtotal = this.productos.reduce((acc, p) => {
      const precio = Number(p.precio_unitario) || 0;
      const cantidad = Number(p.cantidad) || 1;
      return acc + (precio * cantidad);
    }, 0);

    // Total = subtotal + costo de envío.
    this.total = Number(this.subtotal) + Number(this.envio);
  }

  // Ejecuta la operación principal: finalizar la compra.
  finalizarCompra() {

    // Verifica que haya productos en el carrito.
    if (this.productos.length === 0) {
      this.mensaje = 'El carrito está vacío';
      return;
    }

    // Datos adicionales del comprador (se envían al backend si se usan).
    const data = {
      direccion: this.datos.direccion,
      telefono: this.datos.telefono
    };

    // Marca estado de carga para bloquear UI si fuera necesario.
    this.cargando = true;

    // Llama al backend para crear la compra, generar ticket y vaciar el carrito.
    this.compraService.finalizarCompra(data).subscribe({
      next: res => {

        // Mensaje informativo.
        this.mensaje = 'Compra realizada con éxito';

        // Vaciar carrito localmente y en backend.
        this.carritoService.vaciarCarrito().subscribe();

        // Navegar al ticket luego de 1 segundo (simula efecto visual).
        setTimeout(() => {
          this.router.navigate(['/ticket', res.id_compra]);
        }, 1000);
      },
      
      // Si hubo error en el proceso:
      error: err => {
        console.error(err);
        this.mensaje = 'Error al procesar compra.';
        this.cargando = false;
      }
    });
  }
}







  /*
  //Declaracion del formulario reactivo para la compra
  formularioCompra!: FormGroup;

  //Variable para almacenar el total de la compra(subtotal+envio)
  total!:number

  //Costo fijo de envio
  envio = 5000

  //indicador para saber si la factura ya fue generada
  facturaGenerada = false

  //Objeto que contiene la informacion de la factura generada
  factura: any

  //Controla la visibilidad del modal que muestra el PDF
  mostrarModal = false

  //Fuente segura para mostrar el PDF generado en el iframe (URL sanitizada)
  pdfSrc: SafeResourceUrl | undefined;

  constructor(
    private fb:FormBuilder,  // FormBuilder para crear el formulario activo
    private carritoService:CarritoService, //Servicio para manejar el carrito y obtener productos y total
    private sanitizer: DomSanitizer //Para sanitizar la URL del PDF y que angular lo permita mostrar
  ){}

  //Metodo que se ejecuta al inicializar el componente
  ngOnInit(): void {
    //Formulario con los campos requeridos y validadores
    this.formularioCompra = this.fb.group({
      nombre:['',Validators.required],
      direccion : ['',Validators.required],
      correo : ['',[Validators.required, Validators.email]],
      telefono : ['',Validators.required],
      codigoPostal : ['',Validators.required],
      ciudad : ['',Validators.required],
      provincia : ['',Validators.required],
      metodoPago : ['',Validators.required],
    })
  }
  //Calcula el total de la compra sumando el subtotal y el costo de envio
  calcularTotal():number{
    const subtotal = this.carritoService.obtenerTotal(); //Obtiene subtotal del carrito
    this.total = subtotal+ this.envio
    return this.total
  }

  //Prepara los datos para la factura con cliente,productos, totales y fecha
  emitirFactura():void{
    const datosCliente = this.formularioCompra.value; //Datos ingresados del formulario
    const productos = this.carritoService.obtenerProductos(); //Productos del carrito
    const totalFinal = this.calcularTotal(); //Total calculado con envio

    // Construye el objeto factura con toda la info necesaria
    this.factura = {
      cliente: datosCliente,
      productos: productos,
      envio: this.envio,
      total: totalFinal,
      fecha: new Date()
    };

    //Marca que la factura fue generada
    this.facturaGenerada = true;
  }
  //Metodo que se ejecuta al finalizar la compra(click al boton)
  //Verifica validez del formulario, genera factura y muestra PDF
  finalizarCompra(): void{
    if(this.formularioCompra.valid){
      this.emitirFactura(); //Crea la factura
      this.generarPDFModal(); //Genera y muestra el PDF en modal
    }else{
      this.formularioCompra.markAllAsTouched(); //Marca todos los campos como tocados para mostrar errores
    }
  }

  //Genera el PDF con jsPDF y crea la URL para mostrar en iframe dentro del modal
  generarPDFModal():void{
    if(!this.factura) return; //Si no hay Factura, no hace nada

    const doc = new jsPDF(); //Crea instancia de jsPDF

    //Agrega titulo y fecha al PDF
    doc.setFontSize(18)
    doc.text('Factura de Compra',14,20)

    doc.setFontSize(12);
    doc.text(`Fecha: ${this.factura.fecha.toLocaleString()}`,14,30)

    //Informacion del cliente
    doc.text('Cliente:',14,40);
    const c = this.factura.cliente;
    doc.text(`Nombre: ${c.nombre}`,20,50);
    doc.text(`Direccion: ${c.direccion}`,20,60);
    doc.text(`Correo: ${c.correo}`,20,70);
    doc.text(`Telefono: ${c.telefono}`,20,80);
    doc.text(`Ciudad: ${c.ciudad}`,20,90);
    doc.text(`Provincia: ${c.provincia}`,20,100);
    doc.text(`Codigo Postal: ${c.codigoPostal}`,20,110);
  
    //Listado de productos con candtidad, precio y subtotal
    let y = 120
    doc.text('Productos:',14,y)

    this.factura.productos.forEach((item:any, index:number) => {
      y += 10;
      doc.text(
        `${index+1}. ${item.producto.nombre} - Cantidad: ${item.cantidad} - Precio: ${item.producto.precio.toFixed(2)} - Subtotal: $${(item.producto.precio * item.cantidad).toFixed(2)}`,20,y)
    })
    
    //Costos finales
    y += 10;
    doc.text(`Costo de Envio: $${this.factura.envio.toFixed(2)}`,14,y);
    y += 10;
    doc.text(`Total a Pagar: $${this.factura.total.toFixed(2)}`,14,y);

    //Convierte el PDF y genera una URL segura para Angular
    const pdfBlob = doc.output('blob')
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(pdfBlob))

    //Abre el modal que contiene el PDF
    this.mostrarModal = true;
  }

  // Metodo para cerrar el modal y liberar la URL del PDF para evitar fugas de memoria
  cerrarModal(): void{
    this.mostrarModal = false;
    if(this.pdfSrc) {
      // se revoca la URL para liberar recursos
      URL.revokeObjectURL((this.pdfSrc as any).changingThisBreaksApplicationSecurity)
      this.pdfSrc = undefined
    }
  }
  //Metodo para imprimir el PDF que esta cargando dentro del iframe en la vista
  imprimirPDF(): void{
    //Obtiene la referencia al elemento iframe del DOM mediante su ID 'pdfFrame'
    //Puede devolver null si no se encuentra el elemento
    const iframe :  HTMLIFrameElement | null = document.getElementById('pdfFrame') as HTMLIFrameElement;

    //Verifica que el iframe exista y que tenga un objeto contentWindow valido
    if(iframe && iframe.contentWindow){
      //le da foco al contenido del iframe para asegurarse que la ventana correcta esta activa para imprimir
      iframe.contentWindow.focus();

      //llama al metodo print() de la ventana del iframe para abrirla ventana de impresion del navegador
      iframe.contentWindow.print();
    }
  }
}
  */