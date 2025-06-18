// Preview de imágenes
      function setupImagePreview(inputId, previewId, imgId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        const img = document.getElementById(imgId);

        input.addEventListener('change', function(e) {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
              img.src = e.target.result;
              preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
          }
        });
      }

      // Configurar previews
      setupImagePreview('fotoAlumno', 'previewAlumno', 'imgAlumno');
      setupImagePreview('foto1', 'preview1', 'img1');
      setupImagePreview('foto2', 'preview2', 'img2');
      setupImagePreview('foto3', 'preview3', 'img3');

      // Función para convertir imagen a base64
      function fileToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      // Función principal para generar PDF
      async function generatePDF(formData) {
        const { jsPDF } = window.jspdf;
        
        // Crear PDF en formato carta
        const pdf = new jsPDF('p', 'mm', 'letter');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Colores
        const primaryColor = [79, 70, 229]; // Azul púrpura
        const secondaryColor = [124, 58, 237]; // Púrpura
        const textColor = [55, 65, 81]; // Gris oscuro

        // ==================== PÁGINA 1: DATOS DEL ALUMNO ====================
        
        // Fondo degradado (simulado con rectángulos)
        pdf.setFillColor(240, 240, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Elementos decorativos laterales
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.triangle(10, 20, 25, 5, 40, 20, 'F');
        pdf.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        pdf.triangle(pageWidth - 40, 20, pageWidth - 25, 5, pageWidth - 10, 20, 'F');

        // Título "AVENTURA"
        pdf.setFontSize(36);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text('AVENTURA', pageWidth / 2, 35, { align: 'center' });

        // Elementos decorativos (simulando fogata y antorcha)
        pdf.setFillColor(255, 140, 0);
        pdf.circle(50, 40, 3, 'F');
        pdf.setFillColor(255, 69, 0);
        pdf.circle(pageWidth - 50, 40, 3, 'F');

        // Marco para foto del alumno
        const photoX = 40;
        const photoY = 60;
        const photoWidth = 50;
        const photoHeight = 60;
        
        // Fondo rosa para el marco
        pdf.setFillColor(255, 192, 203);
        pdf.roundedRect(photoX - 3, photoY - 3, photoWidth + 6, photoHeight + 6, 3, 3, 'F');
        
        // Marco blanco
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(photoX, photoY, photoWidth, photoHeight, 2, 2, 'F');

        // Insertar foto del alumno
        if (formData.fotoAlumno) {
          try {
            pdf.addImage(formData.fotoAlumno, 'JPEG', photoX + 2, photoY + 2, photoWidth - 4, photoHeight - 4);
          } catch (error) {
            console.error('Error al agregar foto del alumno:', error);
          }
        }

        // Campo NOMBRE
        pdf.setFillColor(52, 152, 219);
        pdf.roundedRect(40, 135, 130, 12, 2, 2, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text('NOMBRE', 45, 143);
        
        // Valor del nombre
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(formData.nombre || '', 45, 158);

        // Campo CATEGORÍA
        pdf.setFillColor(52, 152, 219);
        pdf.roundedRect(40, 175, 130, 12, 2, 2, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text('CATEGORÍA:', 45, 183);
        
        // Valor de la categoría
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(formData.categoria || '', 45, 198);

        // Campo FOLIO con código de barras
        pdf.setFillColor(52, 152, 219);
        pdf.roundedRect(40, 215, 130, 12, 2, 2, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text('FOLIO:', 45, 223);
          
        // Texto del folio
        pdf.setFontSize(10);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(formData.folio, 75, 240, { align: 'justify' });

        // Dragón decorativo (simulado con formas)
        pdf.setFillColor(52, 152, 219);
        pdf.circle(15, 180, 8, 'F');
        pdf.setFillColor(255, 255, 255);
        pdf.circle(12, 175, 2, 'F');
        pdf.circle(18, 175, 2, 'F');

        // ==================== PÁGINA 2: PERSONAS AUTORIZADAS ====================
        
        pdf.addPage();
        
        // Fondo de la segunda página
        pdf.setFillColor(240, 240, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        // Título
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text('PERSONAS AUTORIZADAS PARA', 20, 30);
        pdf.text('RECOGER AL NIÑO', 20, 45);

        // Configuración para las tres personas autorizadas
        const personasData = [
          { nombre: formData.autorizado1, foto: formData.foto1 },
          { nombre: formData.autorizado2, foto: formData.foto2 },
          { nombre: formData.autorizado3, foto: formData.foto3 }
        ];

        let currentY = 70;
        
        personasData.forEach((persona, index) => {
          // Marco para foto
          const fotoX = 20;
          const fotoY = currentY;
          const fotoSize = 35;
          
          // Fondo azul oscuro para el marco de foto
          pdf.setFillColor(41, 128, 185);
          pdf.roundedRect(fotoX - 2, fotoY - 2, fotoSize + 4, fotoSize + 4, 2, 2, 'F');
          
          // Marco blanco para la foto
          pdf.setFillColor(255, 255, 255);
          pdf.roundedRect(fotoX, fotoY, fotoSize, fotoSize, 1, 1, 'F');

          // Insertar foto
          if (persona.foto) {
            try {
              pdf.addImage(persona.foto, 'JPEG', fotoX + 1, fotoY + 1, fotoSize - 2, fotoSize - 2);
            } catch (error) {
              console.error(`Error al agregar foto ${index + 1}:`, error);
            }
          }

          // Campos de información
          const fieldX = 70;
          const fieldWidth = 120;
          const fieldHeight = 8;
          
          // Tres campos por persona
          for (let i = 0; i < 1; i++) {
            const fieldY = currentY + (i * 12);
            
            // Fondo azul para el campo
            pdf.setFillColor(52, 152, 219);
            pdf.roundedRect(fieldX, fieldY, fieldWidth, fieldHeight, 1, 1, 'F');
            
            // Texto del nombre solo en el primer campo
            if (i === 0 && persona.nombre) {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(255, 255, 255);
              pdf.text(persona.nombre, fieldX + 3, fieldY + 5);
            }
          }
          
          currentY += 60;
        });

        // Elementos decorativos laterales
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.triangle(pageWidth - 30, 100, pageWidth - 15, 85, pageWidth - 5, 100, 'F');
        pdf.triangle(pageWidth - 30, 160, pageWidth - 15, 145, pageWidth - 5, 160, 'F');
        pdf.triangle(pageWidth - 30, 220, pageWidth - 15, 205, pageWidth - 5, 220, 'F');

        // Guardar el PDF
        const fileName = `Aventura_${formData.nombre ? formData.nombre.replace(/\s+/g, '_') : 'Alumno'}_${formData.folio || 'Sin_Folio'}.pdf`;
        pdf.save(fileName);
      }

      // Manejar envío del formulario
      document.getElementById('formulario').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        try {
          // Cambiar texto del botón
          submitBtn.textContent = '📄 Generando PDF...';
          submitBtn.disabled = true;

          // Recopilar datos del formulario
          const formData = {
            nombre: document.getElementById('nombre').value,
            categoria: document.getElementById('categoria').value,
            folio: document.getElementById('folio').value,
            autorizado1: document.getElementById('autorizado1').value,
            autorizado2: document.getElementById('autorizado2').value,
            autorizado3: document.getElementById('autorizado3').value
          };

          // Convertir imágenes a base64
          const files = ['fotoAlumno', 'foto1', 'foto2', 'foto3'];
          for (const fileId of files) {
            const fileInput = document.getElementById(fileId);
            if (fileInput.files[0]) {
              formData[fileId] = await fileToBase64(fileInput.files[0]);
            }
          }

          // Generar PDF
          await generatePDF(formData);
          
          // Mostrar mensaje de éxito
          alert('✅ PDF generado exitosamente!');
          
        } catch (error) {
          console.error('Error al generar PDF:', error);
          alert('❌ Error al generar el PDF. Por favor, intenta nuevamente.');
        } finally {
          // Restaurar botón
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });