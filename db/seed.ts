import 'dotenv/config';
import { getDb } from '../api/queries/connection';
import { users, accessKeys, excelModules, excelUnits, excelParagraphs, excelExercises, excelQuizQuestions, excelUserProgress, excelAccessRequests } from './schema';
import bcrypt from 'bcryptjs';

// ==================================================
// DEFINICIÓN DE LOS 7 MÓDULOS (contenido completo)
// ==================================================

export interface ExcelParagraph { content: string; imageUrl?: string; imageCaption?: string; }
export interface ExcelExercise { title: string; description: string; solutionHint?: string; }
export interface ExcelQuizQuestion { questionText: string; options: string[]; correctAnswer: number; explanation: string; }
export interface ExcelUnit { title: string; description?: string; paragraphs: ExcelParagraph[]; exercises: ExcelExercise[]; quizQuestions: ExcelQuizQuestion[]; }
export interface ExcelModule { order: number; title: string; description: string; coverImage: string; durationHours: number; units: ExcelUnit[]; }


// ==========================================================
// MÓDULO 1 COMPLETO (6 unidades)
// ==========================================================
const module1: ExcelModule = {
  order: 1,
  title: "Tablas Dinámicas Avanzadas y Segmentación de Datos",
  description: "Aprende a crear tablas dinámicas complejas, usar segmentadores, líneas de tiempo y realizar análisis multivariable.",
  coverImage: "/images/excel/module01_hero.png",
  durationHours: 6,
  units: [
    {
      title: "1.1 Consolidación de Datos desde Múltiples Orígenes",
      description: "Combina datos de diferentes hojas y libros sin copiar manualmente.",
      paragraphs: [
        { content: "<p>Cuando los datos están dispersos en varias hojas o archivos, la función de tabla dinámica con rangos múltiples es esencial. Presiona <b>ALT+D+P</b> para abrir el asistente y elige <b>'Consolidar rangos múltiples'</b>. Luego selecciona cada rango, asigna nombres de campo y obtendrás una tabla dinámica unificada. Esta técnica es ideal para informes mensuales o trimestrales.</p>", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", imageCaption: "Asistente de tablas dinámicas múltiples" },
        { content: "<p>Una alternativa más moderna y potente es <b>Power Query</b> (Obtener y transformar datos). Con Power Query puedes conectarte a una carpeta completa, combinar todos los archivos de Excel y cargar el resultado directamente a una tabla dinámica. La ventaja es que, al agregar nuevos archivos en la carpeta, solo necesitas actualizar la consulta. En este módulo aprenderás ambas técnicas y cuándo usar cada una.</p>" }
      ],
      exercises: [
        { title: "Ejercicio 1 - Consolidación de ventas trimestrales", description: "Tienes tres hojas: Enero, Febrero, Marzo con ventas por producto. Crea una tabla dinámica que muestre el total por producto y el promedio mensual.", solutionHint: "Usa ALT+D+P. En el asistente, selecciona cada rango y en 'Campo página' asigna el nombre del mes. Luego configura la tabla dinámica con productos en filas y suma en valores." }
      ],
      quizQuestions: [
        { questionText: "¿Qué combinación de teclas abre el asistente de tabla dinámica para rangos múltiples?", options: ["ALT+D+P", "CTRL+MAYÚS+P", "ALT+F1", "CTRL+T"], correctAnswer: 0, explanation: "ALT+D+P es el atajo clásico que muestra el asistente de tablas dinámicas." },
        { questionText: "¿Cuál es la ventaja de usar Power Query sobre el asistente de rangos múltiples?", options: ["Mayor velocidad", "Actualización automática con un clic", "Permite gráficos", "No requiere rangos nombrados"], correctAnswer: 1, explanation: "Power Query permite refrescar los datos con un clic y se adapta a nuevos archivos." },
        { questionText: "¿Qué función de Excel permite crear rangos dinámicos que se redimensionan automáticamente?", options: ["BUSCARV", "INDIRECTO", "SUMAR.SI", "CONTARA"], correctAnswer: 1, explanation: "INDIRECTO combinado con rangos nombrados dinámicos se ajusta al agregar nuevas filas." },
        { questionText: "¿Qué herramienta de Excel es más adecuada para combinar archivos de una carpeta automáticamente?", options: ["Tabla dinámica", "Power Query", "Macro VBA", "Validación de datos"], correctAnswer: 1, explanation: "Power Query puede leer todos los archivos de una carpeta y combinarlos sin macros." },
        { questionText: "¿Qué control visual permite filtrar una tabla dinámica con botones interactivos?", options: ["Segmentador", "Línea de tiempo", "Cortador manual", "Filtro rápido"], correctAnswer: 0, explanation: "Segmentador (Slicer) es el control visual para filtrar." },
        { questionText: "¿Cómo se llama el campo que añade el asistente de rangos múltiples para identificar el origen de cada fila?", options: ["Campo Página", "Campo Fila", "Campo Columna", "Campo Valor"], correctAnswer: 0, explanation: "El asistente añade un 'Campo Página' que contiene el nombre asignado a cada rango." },
        { questionText: "¿Cuál es el límite de filas que puede manejar una tabla dinámica en Excel 365?", options: ["1,048,576", "1,000,000", "Sin límite", "2,000,000"], correctAnswer: 0, explanation: "El límite de filas de una hoja de Excel es 1,048,576; la tabla dinámica puede procesar ese volumen." },
        { questionText: "¿Qué debes hacer si al actualizar una tabla dinámica los nuevos datos no aparecen porque sobrepasan el rango original?", options: ["Refrescar", "Cambiar origen de datos", "Rehacer la tabla", "Usar Power Query"], correctAnswer: 1, explanation: "Hay que modificar el rango origen o usar rangos dinámicos para que incluya las nuevas filas." }
      ]
    },
    {
      title: "1.2 Segmentadores y Líneas de Tiempo para Filtros Interactivos",
      description: "Mejora la usabilidad de tus tablas dinámicas con controles visuales.",
      paragraphs: [
        { content: "Los <b>segmentadores</b> (slicers) son botones visuales que permiten filtrar datos de forma intuitiva, ideales para dashboards. Se conectan fácilmente a una o varias tablas dinámicas. Para agregar un segmentador, selecciona la tabla dinámica, ve a 'Analizar' > 'Insertar segmentador' y elige el campo. Puedes personalizar los colores y el diseño.", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600", imageCaption: "Segmentadores y líneas de tiempo" },
        { content: "Las <b>líneas de tiempo</b> son un tipo especial de segmentador para fechas. Permiten filtrar por años, meses, trimestres y días con una línea deslizante. Puedes conectar una línea de tiempo a múltiples tablas dinámicas que compartan el mismo campo de fecha. Veremos cómo crear paneles de control interactivos sin macros." }
      ],
      exercises: [
        { title: "Ejercicio 2 - Dashboard con dos tablas dinámicas vinculadas", description: "Crea dos tablas dinámicas a partir de los mismos datos de ventas: una con ventas por producto y otra por vendedor. Agrega un segmentador para el campo 'Región' que controle ambas tablas.", solutionHint: "Inserta segmentador, luego en 'Conexiones de informe' vincula las dos tablas dinámicas." }
      ],
      quizQuestions: [
        { questionText: "¿Qué control visual permite filtrar por rangos de fechas con una barra deslizante?", options: ["Segmentador", "Línea de tiempo", "Control deslizante", "Calendario"], correctAnswer: 1, explanation: "Línea de tiempo es exclusivo para fechas." },
        { questionText: "¿Puede un segmentador filtrar dos tablas dinámicas a la vez?", options: ["Sí, si se configuran las conexiones", "No, solo una tabla", "Sí, siempre", "Depende de la versión"], correctAnswer: 0, explanation: "En 'Conexiones de informe' se pueden vincular varias tablas dinámicas a un segmentador." },
        { questionText: "¿Cuál es la diferencia principal entre un segmentador y un filtro común?", options: ["El segmentador es visual e interactivo", "El filtro es más rápido", "El segmentador permite múltiples selecciones", "No hay diferencia"], correctAnswer: 0, explanation: "El segmentador provee botones visuales más amigables." },
        { questionText: "¿Qué elemento de Excel se usa para filtrar jerarquías de fechas (año, trimestre, mes) de forma dinámica?", options: ["Segmentador de fechas", "Línea de tiempo", "Filtro automático", "Tabla dinámica"], correctAnswer: 1, explanation: "Línea de tiempo permite agrupar en niveles de fecha." },
        { questionText: "¿Cómo se actualiza un segmentador si los datos origen cambian y aparecen nuevas categorías?", options: ["Automáticamente", "Refrescando la tabla dinámica", "Reinsertando el segmentador", "Manual"], correctAnswer: 1, explanation: "Al refrescar la tabla dinámica, el segmentador detecta los nuevos valores." },
        { questionText: "¿Qué tamaño máximo de botones se puede establecer en un segmentador?", options: ["No hay límite", "Hasta 100 píxeles", "Depende del ancho de la celda", "El tamaño es fijo"], correctAnswer: 0, explanation: "Puedes ajustar el alto y ancho de cada botón libremente." },
        { questionText: "¿Se pueden compartir segmentadores entre tablas dinámicas ubicadas en diferentes hojas?", options: ["Sí, con la opción 'Conexiones de informe'", "No, solo en la misma hoja", "Sí, pero solo si son del mismo libro", "No, es imposible"], correctAnswer: 0, explanation: "Puedes vincular segmentadores a tablas en cualquier hoja del mismo libro." },
        { questionText: "¿Qué tipo de campo no puede usarse en un segmentador?", options: ["Campos de texto", "Campos numéricos", "Campos de fecha", "Campos calculados"], correctAnswer: 1, explanation: "Los segmentadores funcionan con cualquier campo, incluyendo numéricos, pero son menos prácticos que con texto." }
      ]
    },
    {
      title: "1.3 Cálculos Avanzados con Campos y Elementos Calculados",
      description: "Amplía las capacidades analíticas añadiendo fórmulas dentro de la tabla dinámica.",
      paragraphs: [
        { content: "Los <b>campos calculados</b> permiten crear nuevas columnas en la tabla dinámica usando fórmulas que operan sobre los datos originales. Por ejemplo, puedes crear un campo 'Margen' = 'Ingresos' - 'Costos'. Ve a 'Analizar' > 'Campos, elementos y conjuntos' > 'Campo calculado'. La fórmula se evalúa por cada fila de la tabla.", imageUrl: "https://images.unsplash.com/photo-1554224311-6f5e6e0de48b?w=600", imageCaption: "Creación de campos calculados" },
        { content: "Los <b>elementos calculados</b> son similares, pero actúan sobre los elementos de un campo (por ejemplo, sumar dos productos). Son útiles para agregar categorías personalizadas. Es importante entender que estos cálculos se realizan sobre el agregado, no sobre los datos originales, por lo que hay que tener cuidado con los totales. Veremos ejemplos prácticos de KPIs." }
      ],
      exercises: [
        { title: "Ejercicio 3 - Campo calculado de rentabilidad", description: "Con una tabla de ventas (ingresos, costos y cantidad), crea un campo calculado que muestre el margen de beneficio absoluto (ingresos - costos) y otro que muestre el margen porcentual (margen/ingresos).", solutionHint: "Inserta campo calculado: = Ingresos - Costos. Para porcentaje: = (Ingresos - Costos)/Ingresos. Formatea como porcentaje." }
      ],
      quizQuestions: [
        { questionText: "¿Dónde se encuentra la opción para agregar un campo calculado en una tabla dinámica?", options: ["Analizar > Campos, elementos y conjuntos", "Diseño > Herramientas", "Fórmulas > Definir nombre", "Power Pivot > Medidas"], correctAnswer: 0, explanation: "Está en la pestaña 'Analizar' o 'Análisis', grupo 'Cálculos'." },
        { questionText: "Una diferencia clave entre campo calculado y elemento calculado es…", options: ["El campo calculado crea una nueva columna; el elemento calculado agrupa elementos", "El elemento calculado solo funciona con números", "No hay diferencia", "El campo calculado es más rápido"], correctAnswer: 0, explanation: "El campo calculado opera sobre campos; el elemento calculado sobre elementos de un campo." },
        { questionText: "¿Qué sucede con los totales generales cuando usas campos calculados?", options: ["Pueden duplicar sumas", "Se desactivan automáticamente", "Se calculan correctamente", "No se muestran"], correctAnswer: 0, explanation: "Los campos calculados suman los valores calculados por fila, lo que puede ser incorrecto si la fórmula no es lineal." },
        { questionText: "¿Puede un campo calculado usar funciones como BUSCARV?", options: ["No", "Sí", "Depende de la versión", "Solo en Excel 365"], correctAnswer: 0, explanation: "Las fórmulas en campos calculados solo pueden usar funciones de resumen (SUM, IF, etc.) y no referencias a celdas externas." },
        { questionText: "¿Qué es un elemento calculado?", options: ["Un nuevo valor dentro de un campo existente", "Una nueva columna", "Una macro", "Un gráfico"], correctAnswer: 0, explanation: "Permite crear, por ejemplo, 'Total Norte+Sur' como elemento dentro del campo 'Región'." },
        { questionText: "Si se crea un campo calculado 'Ganancia' = Ventas - Costo, ¿cómo se comporta al filtrar solo algunos productos?", options: ["Solo muestra Ganancia para los productos filtrados", "Muestra Ganancia global", "Da error", "Se desactiva"], correctAnswer: 0, explanation: "Respeta los filtros aplicados." },
        { questionText: "¿Podemos usar referencias a celdas externas en la fórmula de un campo calculado?", options: ["No", "Sí", "Con nombre definido sí", "Solo con INDIRECTO"], correctAnswer: 0, explanation: "No se permite; las fórmulas solo pueden usar los campos de la tabla dinámica." },
        { questionText: "¿Qué función es útil para condicionales dentro de un campo calculado?", options: ["IF", "BUSCARV", "PROMEDIO", "CONTAR"], correctAnswer: 0, explanation: "Puedes usar IF para crear categorías condicionales, por ejemplo =IF(Ventas>1000, 'Alto', 'Bajo')." }
      ]
    },
    {
      title: "1.4 Tablas Dinámicas con Power Pivot y Modelos de Datos",
      description: "Conecta múltiples tablas y crea relaciones avanzadas.",
      paragraphs: [
        { content: "Power Pivot es un complemento de Excel que permite trabajar con grandes volúmenes de datos y crear relaciones entre tablas. Cuando marcas 'Agregar estos datos al modelo de datos' al crear una tabla dinámica, estás usando Power Pivot. Esto te permite construir tablas dinámicas basadas en múltiples tablas relacionadas (hechos y dimensiones).", imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600", imageCaption: "Modelo de datos en Power Pivot" },
        { content: "Una vez en el modelo, puedes crear medidas con DAX (Data Analysis Expressions), que son fórmulas avanzadas que superan a los campos calculados tradicionales. Por ejemplo, 'Ventas YTD' = TOTALYTD(SUM(Ventas), Fecha[Fecha]). Aprenderás los fundamentos de DAX para potenciar tus análisis." }
      ],
      exercises: [
        { title: "Ejercicio 4 - Crear una relación entre tablas", description: "Importa dos tablas: 'Ventas' y 'Productos'. Crea una relación por el campo 'ProductoID' y crea una tabla dinámica que muestre ventas por categoría de producto.", solutionHint: "Usa 'Administrar relaciones' en la pestaña Datos o directamente en Power Pivot. Luego inserta tabla dinámica usando 'Más tablas...' y selecciona ambas tablas." }
      ],
      quizQuestions: [
        { questionText: "¿Qué complemento de Excel gestiona el modelo de datos?", options: ["Power Pivot", "Power Query", "Power View", "Power Map"], correctAnswer: 0, explanation: "Power Pivot es el motor de modelado de datos en memoria." },
        { questionText: "¿Cuál es el lenguaje de fórmulas usado en Power Pivot?", options: ["DAX", "M", "VBA", "SQL"], correctAnswer: 0, explanation: "DAX (Data Analysis Expressions) es el lenguaje de Power Pivot." },
        { questionText: "¿Qué opción debes marcar para que una tabla dinámica utilice el modelo de datos?", options: ["Agregar estos datos al modelo de datos", "Usar Power Query", "Crear relación", "Modelo de datos"], correctAnswer: 0, explanation: "Aparece en el cuadro de diálogo al insertar tabla dinámica." },
        { questionText: "¿Qué función DAX permite sumar un campo ignorando filtros?", options: ["SUMX", "CALCULATE", "SUM", "FILTER"], correctAnswer: 1, explanation: "CALCULATE modifica el contexto de filtro, y combinado con ALL, suma todo." },
        { questionText: "¿Es Power Pivot solo para versiones de Excel profesionales?", options: ["Sí, está en versiones Pro y 365", "No, está en todas", "Solo en Mac", "Solo en Office Online"], correctAnswer: 0, explanation: "Está disponible en Excel 2010 Professional Plus y versiones posteriores, incluyendo Microsoft 365." },
        { questionText: "¿Puedes conectar Power Pivot a bases de datos externas?", options: ["Sí", "No", "Solo a Access", "Solo a SQL Server"], correctAnswer: 0, explanation: "Soporta múltiples orígenes: SQL Server, Oracle, Access, etc." },
        { questionText: "Una medida creada en Power Pivot se guarda en…", options: ["El modelo de datos", "La tabla dinámica", "Una celda", "Un rango nombrado"], correctAnswer: 0, explanation: "Las medidas se almacenan en el modelo y pueden reutilizarse." },
        { questionText: "¿Qué función DAX calcularía ventas del mes anterior?", options: ["PREVIOUSMONTH", "DATEADD", "SAMEPERIODLASTYEAR", "TOTALMTD"], correctAnswer: 0, explanation: "PREVIOUSMONTH devuelve las fechas del mes anterior según el contexto actual." }
      ]
    },
    {
      title: "1.5 Gráficos Dinámicos y Dashboards Interactivos",
      description: "Visualiza tus tablas dinámicas con gráficos que se actualizan automáticamente.",
      paragraphs: [
        { content: "Los gráficos dinámicos son la representación gráfica de una tabla dinámica. Comparten los mismos filtros y segmentadores, lo que permite crear dashboards interactivos. Para insertar uno, selecciona la tabla dinámica y ve a 'Analizar' > 'Gráfico dinámico'.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", imageCaption: "Gráfico dinámico interactivo" },
        { content: "La combinación de segmentadores, líneas de tiempo y varios gráficos dinámicos en una misma hoja permite construir paneles de control profesionales, ideales para ejecutivos. Aprenderás a sincronizar todos los elementos y a diseñar un layout atractivo." }
      ],
      exercises: [
        { title: "Ejercicio 5 - Dashboard ejecutivo", description: "Crea un dashboard con: una tabla dinámica de ventas por producto, una línea de tiempo por fecha, un gráfico de barras de ventas por región y un indicador de total de ventas. Todo debe filtrarse simultáneamente.", solutionHint: "Usa segmentadores y líneas de tiempo, y vincúlalos a todos los elementos (tabla y gráfico)." }
      ],
      quizQuestions: [
        { questionText: "¿Puede un gráfico dinámico existir sin una tabla dinámica subyacente?", options: ["No, es una representación de una tabla dinámica", "Sí, como gráfico normal", "Sí, con rangos dinámicos", "Solo si se usa Power View"], correctAnswer: 0, explanation: "El gráfico dinámico está intrínsecamente ligado a una tabla dinámica." },
        { questionText: "¿Los segmentadores afectan también a los gráficos dinámicos?", options: ["Sí, si están conectados", "No, solo afectan tablas", "Sí, automáticamente", "Solo si usas el mismo campo"], correctAnswer: 0, explanation: "Puedes conectar un segmentador a tablas y gráficos." },
        { questionText: "¿Qué elemento no puede usarse en un gráfico dinámico?", options: ["Líneas de tendencia", "Etiquetas de datos", "Diferentes tipos de gráfico combinados", "Ejes secundarios"], correctAnswer: 2, explanation: "No se pueden combinar tipos de gráfico (columna + línea) en un mismo gráfico dinámico, a diferencia de los gráficos normales." },
        { questionText: "¿Cómo se actualiza un gráfico dinámico cuando cambian los datos fuente?", options: ["Automáticamente al refrescar la tabla dinámica", "Manual", "Se actualiza solo", "Requiere reiniciar Excel"], correctAnswer: 0, explanation: "Refrescar la tabla dinámica actualiza también el gráfico." },
        { questionText: "¿Se puede exportar un gráfico dinámico a PowerPoint manteniendo la interactividad?", options: ["No, se pierde la interactividad", "Sí, como objeto OLE", "Sí, como imagen", "Depende de la versión"], correctAnswer: 0, explanation: "Al exportar se vuelve estático, no conserva segmentadores ni filtros." },
        { questionText: "¿Cuál es la principal ventaja de usar gráficos dinámicos en lugar de gráficos normales con rangos dinámicos?", options: ["Fácil filtrado mediante segmentadores", "Mejor rendimiento", "Más tipos de gráfico", "Mayor personalización"], correctAnswer: 0, explanation: "La integración nativa con segmentadores y líneas de tiempo." },
        { questionText: "¿Puedes cambiar el tipo de gráfico dinámico (líneas a barras) sin perder los filtros?", options: ["Sí", "No, se reinicia", "Sí, pero hay que rehacer los filtros", "Depende"], correctAnswer: 0, explanation: "Puedes cambiar el tipo de gráfico libremente." },
        { questionText: "¿Qué opción permite mostrar valores como porcentaje del total en un gráfico dinámico?", options: ["Configuración del campo valor", "Formato de gráfico", "Etiquetas de datos personalizadas", "Segmentador"], correctAnswer: 0, explanation: "En la tabla dinámica subyacente, cambias 'Mostrar valores como' a '% del total general'." }
      ]
    },
    {
      title: "1.6 Optimización y Mejores Prácticas con Tablas Dinámicas",
      description: "Consejos para que tus tablas dinámicas sean rápidas y fiables.",
      paragraphs: [
        { content: "Para mejorar el rendimiento con grandes volúmenes de datos, conviene usar rangos de datos que sean <b>tablas de Excel</b> (Ctrl+T) en lugar de rangos normales. Las tablas de Excel se expanden automáticamente al agregar nuevas filas, y las tablas dinámicas construidas sobre ellas actualizan el origen sin necesidad de cambiar manualmente el rango.", imageUrl: "https://images.unsplash.com/photo-1554224311-6f5e6e0de48b?w=600", imageCaption: "Uso de tablas de Excel" },
        { content: "Otra buena práctica es deshabilitar 'Guardar origen de datos con archivo' y 'Actualizar al abrir' en opciones avanzadas de tabla dinámica para reducir el tamaño del archivo y mejorar la velocidad de carga. También es recomendable usar <b>Power Pivot</b> cuando el origen supere las 100,000 filas, ya que comprime los datos." }
      ],
      exercises: [
        { title: "Ejercicio 6 - Convertir rango a tabla", description: "Convierte un rango de datos de ventas en una tabla de Excel (Ctrl+T). Luego construye una tabla dinámica sobre esa tabla y añade dos nuevas filas de datos. Comprueba que al refrescar la tabla dinámica, los nuevos datos se incluyan automáticamente.", solutionHint: "Convierte el rango a tabla con 'Insertar > Tabla'. La tabla dinámica basada en la tabla se actualizará con el nuevo rango." }
      ],
      quizQuestions: [
        { questionText: "¿Qué ventaja tiene usar una tabla de Excel como origen de una tabla dinámica?", options: ["Expansión automática", "Mayor velocidad", "Más columnas", "Menor uso de memoria"], correctAnswer: 0, explanation: "Las tablas se ajustan dinámicamente al añadir filas, por lo que la tabla dinámica las incluye al refrescar." },
        { questionText: "¿Dónde se activa la opción 'Deshabilitar guardado de origen de datos'?", options: ["Opciones de tabla dinámica > Datos", "Propiedades de la tabla", "Configuración de Power Pivot", "Opciones de Excel"], correctAnswer: 0, explanation: "En el cuadro de diálogo 'Opciones de tabla dinámica', pestaña 'Datos'." },
        { questionText: "¿Qué herramienta de Excel permite trabajar con orígenes de más de 1 millón de filas?", options: ["Power Pivot", "Power Query", "Tabla dinámica clásica", "Power Map"], correctAnswer: 0, explanation: "Power Pivot puede manejar cientos de millones de filas al usar su motor en memoria." },
        { questionText: "¿Cuál es el atajo para convertir un rango en tabla de Excel?", options: ["Ctrl+T", "Ctrl+Shift+L", "Ctrl+Alt+T", "Ctrl+L"], correctAnswer: 0, explanation: "Ctrl+T (o Ctrl+L en algunas versiones) crea una tabla." },
        { questionText: "¿Qué opción de actualización consume menos recursos al abrir un archivo con tablas dinámicas?", options: ["Actualizar manualmente", "Actualizar al abrir", "Actualizar al guardar", "Actualizar con conexiones"], correctAnswer: 0, explanation: "Desactivar 'Actualizar al abrir' evita recálculos iniciales lentos." },
        { questionText: "¿Es recomendable usar nombres de campo muy largos en tablas dinámicas?", options: ["No, porque dificultan la legibilidad y el rendimiento", "Sí, para ser descriptivos", "No afecta", "Solo si son únicos"], correctAnswer: 0, explanation: "Nombres largos pueden afectar la presentación pero no el rendimiento; sin embargo, se recomienda brevedad." },
        { questionText: "¿Qué función permite desglosar (drill down) una celda de una tabla dinámica para ver los detalles?", options: ["Doble clic en el valor", "Botón derecho > Desglosar", "Hacer clic derecho", "Ctrl+clic"], correctAnswer: 0, explanation: "Hacer doble clic sobre un número muestra una nueva hoja con los registros originales que componen ese valor." },
        { questionText: "¿Qué sucede si mueves una tabla dinámica de lugar y el origen está en otra hoja?", options: ["Sigue funcionando", "La referencia se pierde", "Hay que rehacerla", "Solo funciona en la misma hoja"], correctAnswer: 0, explanation: "La tabla dinámica conserva su conexión al origen aunque se mueva." }
      ]
    }
  ]
};
// ==========================================================
// MÓDULO 2: Funciones Lógicas y de Búsqueda para Análisis de Datos
// ==========================================================
const module2: ExcelModule = {
  order: 2,
  title: "Funciones Lógicas y de Búsqueda para Análisis de Datos",
  description: "Domina SI, Y, O, BUSCARV, XLOOKUP, INDICE y COINCIDIR para resolver problemas complejos.",
  coverImage: "/images/excel/module02_hero.png",
  durationHours: 5,
  units: [
    {
      title: "2.1 Funciones Lógicas Anidadas: SI, Y, O",
      description: "Construye condiciones múltiples.",
      paragraphs: [
        { content: "La función <b>SI</b> es la base de la lógica en Excel. Su sintaxis es <code>SI(prueba_lógica; valor_si_verdadero; valor_si_falso)</code>. Para evaluar múltiples condiciones, se pueden anidar varios SI, por ejemplo <code>=SI(A1>100; \"Alto\"; SI(A1>50; \"Medio\"; \"Bajo\"))</code>.", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600", imageCaption: "Anidación de funciones SI" },
        { content: "Las funciones <b>Y</b> y <b>O</b> permiten combinar condiciones. <code>Y(cond1; cond2)</code> devuelve VERDADERO solo si todas son ciertas. <code>O(cond1; cond2)</code> devuelve VERDADERO si alguna lo es. Se usan dentro de SI: <code>=SI(Y(A1>10; A1<100); \"Válido\"; \"Inválido\")</code>. Exploraremos ejemplos de segmentación de clientes y clasificación de inventarios." }
      ],
      exercises: [
        { title: "Clasificación de notas", description: "Tienes una columna con calificaciones del 0 al 100. Crea una fórmula que devuelva: 'Excelente' (>=90), 'Notable' (>=70), 'Aprobado' (>=50), 'Suspenso' (<50).", solutionHint: "Usa SI anidado: =SI(A1>=90,\"Excelente\",SI(A1>=70,\"Notable\",SI(A1>=50,\"Aprobado\",\"Suspenso\")))" }
      ],
      quizQuestions: [
        { questionText: "¿Cuál es la sintaxis correcta de SI en Excel?", options: ["SI(prueba; verdadero; falso)", "IF(prueba; verdadero; falso)", "SI(prueba, verdadero, falso)", "SI[prueba, verdadero, falso]"], correctAnswer: 0, explanation: "En español, SI(prueba_logica; valor_si_verdadero; valor_si_falso)" },
        { questionText: "¿Qué función devuelve VERDADERO si al menos una condición es verdadera?", options: ["O", "Y", "NO", "SI"], correctAnswer: 0, explanation: "O (OR) devuelve verdadero si alguna condición se cumple." },
        { questionText: "¿Cómo combinarías condiciones 'A>5 y B<10' dentro de un SI?", options: ["SI(Y(A>5; B<10); ...)", "SI(A>5 y B<10; ...)", "SI(A>5; B<10; ...)", "SI(AND(A>5, B<10); ...)"], correctAnswer: 0, explanation: "Se usa Y(A>5; B<10) dentro del primer argumento de SI." },
        { questionText: "¿Qué devuelve =SI(10>5; \"OK\"; \"NO\")?", options: ["OK", "NO", "VERDADERO", "FALSO"], correctAnswer: 0, explanation: "Como 10>5 es verdadero, devuelve 'OK'." },
        { questionText: "¿Cuál es el límite de anidamiento de SI en versiones modernas de Excel?", options: ["64", "7", "Sin límite", "255"], correctAnswer: 0, explanation: "A partir de Excel 2007, se pueden anidar hasta 64 funciones SI." },
        { questionText: "¿Cómo evitas errores con muchos SI anidados?", options: ["Usando IFS", "Usando BUSCARV", "Usando SUMAR.SI", "Usando INDICE"], correctAnswer: 0, explanation: "IFS (disponible desde 2019) permite múltiples condiciones sin anidamiento." },
        { questionText: "¿Qué función lógica invierte el valor de una condición?", options: ["NO", "SI.NO", "INVERSO", "NOT"], correctAnswer: 0, explanation: "NO(condición) devuelve VERDADERO si cond es falsa y viceversa." },
        { questionText: "¿Cuál sería el resultado de =SI(Y(5>3; 2>5); \"A\"; \"B\")?", options: ["B", "A", "VERDADERO", "FALSO"], correctAnswer: 0, explanation: "Y(5>3,2>5) es falso porque 2>5 es falso, entonces devuelve 'B'." }
      ]
    },
    {
      title: "2.2 BUSCARV y sus limitaciones",
      description: "Aprende a buscar valores verticalmente.",
      paragraphs: [
        { content: "<b>BUSCARV</b> busca un valor en la primera columna de una tabla y devuelve un valor de otra columna de la misma fila. Su sintaxis: <code>=BUSCARV(valor_buscado; matriz_tabla; indicador_columnas; [ordenado])</code>. El cuarto argumento suele ser FALSO para coincidencia exacta. La limitación principal es que busca solo hacia la derecha; no puede devolver columnas a la izquierda.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", imageCaption: "Esquema de BUSCARV" },
        { content: "Otras limitaciones: si el valor buscado aparece más de una vez, solo devuelve la primera coincidencia; además, es sensible a mayúsculas/minúsculas (aunque puede resolverse con otras funciones). Veremos cómo superar estas limitaciones con combinaciones de INDICE y COINCIDIR." }
      ],
      exercises: [
        { title: "Buscar precio de producto", description: "Tienes una tabla con códigos de producto en la columna A y precios en la columna B. Usa BUSCARV para obtener el precio a partir de un código ingresado en una celda.", solutionHint: "=BUSCARV(E2; A:B; 2; FALSO)" }
      ],
      quizQuestions: [
        { questionText: "¿Qué argumento de BUSCARV indica coincidencia exacta?", options: ["FALSO", "VERDADERO", "0", "1"], correctAnswer: 0, explanation: "FALSO (o 0) busca coincidencia exacta; VERDADERO (u omitido) busca aproximada." },
        { questionText: "¿Puede BUSCARV buscar en una columna que esté a la izquierda de la columna de búsqueda?", options: ["No", "Sí", "Sí, con INDICE", "Solo con XLOOKUP"], correctAnswer: 0, explanation: "BUSCARV solo hacia la derecha." },
        { questionText: "¿Qué función reemplaza a BUSCARV sin sus limitaciones?", options: ["XLOOKUP", "BUSCARH", "BUSCAR", "INDICE"], correctAnswer: 0, explanation: "XLOOKUP (Excel 2021/365) busca en ambas direcciones." },
        { questionText: "¿Qué devuelve BUSCARV si no encuentra el valor buscado?", options: ["#N/A", "#VALOR!", "#REF!", "En blanco"], correctAnswer: 0, explanation: "Error #N/A (No disponible)." },
        { questionText: "¿Cuál es la función más adecuada para buscar hacia la izquierda?", options: ["INDICE y COINCIDIR", "BUSCARV", "BUSCARH", "XLOOKUP"], correctAnswer: 2, explanation: "INDICE+COINCIDIR o XLOOKUP (ambas válidas)." },
        { questionText: "Si la matriz_tabla tiene datos en las columnas A:C y quieres extraer la columna C, ¿qué número indicador_columnas usarías?", options: ["3", "2", "1", "C"], correctAnswer: 0, explanation: "La primera columna de la matriz es 1, la segunda 2, la tercera 3." },
        { questionText: "¿Cómo harías que BUSCARV sea insensible a mayúsculas/minúsculas?", options: ["Combinando con MAYUSC/MINUSC", "No es posible", "Con UPPER en el argumento", "Con EXACTO"], correctAnswer: 0, explanation: "Puedes crear una columna auxiliar con =MAYUSC(valor) y buscar sobre ella." },
        { questionText: "¿Qué sucede si usas VERDADERO en BUSCARV y los datos no están ordenados?", options: ["Resultados incorrectos", "Error", "Da coincidencia exacta", "Ordena automáticamente"], correctAnswer: 0, explanation: "Con VERDADERO (aproximada) los datos deben estar ordenados ascendentes, de lo contrario da resultados erróneos." }
      ]
    },
    {
      title: "2.3 XLOOKUP: La evolución de las búsquedas",
      description: "La función más potente y flexible para búsquedas.",
      paragraphs: [
        { content: "<b>XLOOKUP</b> apareció en Excel 2021 y Microsoft 365. Su sintaxis: <code>=XLOOKUP(valor_buscado; matriz_busqueda; matriz_resultado; [si_no_encontrado]; [modo_coincidencia]; [modo_busqueda])</code>. A diferencia de BUSCARV, puede buscar hacia la izquierda, devolver múltiples valores, y no requiere que la matriz_busqueda sea la primera columna.", imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600", imageCaption: "XLOOKUP en acción" },
        { content: "Además, permite búsquedas aproximadas desde arriba o desde abajo, y búsquedas con comodines. Es más fácil de recordar porque separa el rango donde buscar y el rango de resultados. Veremos ejemplos de búsquedas bidireccionales y de múltiples criterios." }
      ],
      exercises: [
        { title: "Buscar con XLOOKUP bidireccional", description: "Tienes una tabla de ventas por producto y mes. Usa XLOOKUP para encontrar las ventas de un producto específico en un mes elegido.", solutionHint: "Combinar dos XLOOKUP: =XLOOKUP(producto; productos; XLOOKUP(mes; meses; matriz_de_ventas))" }
      ],
      quizQuestions: [
        { questionText: "¿Cuántos argumentos obligatorios tiene XLOOKUP?", options: ["3", "2", "4", "5"], correctAnswer: 0, explanation: "Los tres obligatorios: valor_buscado, matriz_busqueda, matriz_resultado." },
        { questionText: "¿XLOOKUP puede devolver un valor de una columna a la izquierda de la columna de búsqueda?", options: ["Sí", "No", "Solo si se usa INDICE", "Depende de la versión"], correctAnswer: 0, explanation: "XLOOKUP no tiene restricción de dirección." },
        { questionText: "¿Qué argumento maneja el 'no encontrado' en XLOOKUP?", options: ["Cuarto argumento (si_no_encontrado)", "Quinto argumento", "Sexto", "No tiene"], correctAnswer: 0, explanation: "El cuarto argumento permite personalizar el mensaje cuando no se encuentra." },
        { questionText: "¿Qué valor usarías para búsqueda exacta en el argumento 'modo_coincidencia'?", options: ["0", "1", "-1", "2"], correctAnswer: 0, explanation: "0 = coincidencia exacta (predeterminado)." },
        { questionText: "¿XLOOKUP devuelve por defecto qué tipo de coincidencia?", options: ["Exacta", "Aproximada mayor", "Aproximada menor", "Comodines"], correctAnswer: 0, explanation: "Por defecto, modo_coincidencia = 0 (exacta)." },
        { questionText: "¿Puede XLOOKUP buscar de abajo hacia arriba?", options: ["Sí, con modo_busqueda = -1", "No", "Sí, con modo_coincidencia = -1", "Sí, con matriz invertida"], correctAnswer: 0, explanation: "El argumento modo_busqueda (6º) permite -1 para búsqueda de último a primero." },
        { questionText: "¿Qué función antigua sigue siendo útil cuando no se tiene XLOOKUP?", options: ["BUSCARV e INDICE+COINCIDIR", "SOLO BUSCARV", "SOLO INDICE", "BUSCARH"], correctAnswer: 0, explanation: "En versiones antiguas, se usan BUSCARV o la combinación INDICE+COINCIDIR." },
        { questionText: "¿XLOOKUP puede devolver una fila completa de resultados (varias columnas)?", options: ["Sí, si matriz_resultado es un rango de varias columnas", "No, solo una celda", "Sí, usando la función FILTRAR", "Solo con matrices dinámicas"], correctAnswer: 0, explanation: "Si matriz_resultado abarca varias columnas, XLOOKUP devuelve esa fila completa (desbordamiento)." }
      ]
    },
    {
      title: "2.4 INDICE y COINCIDIR: La combinación clásica y flexible",
      description: "Crea búsquedas bidireccionales y supera las limitaciones de BUSCARV.",
      paragraphs: [
        { content: "La combinación <b>INDICE</b> + <b>COINCIDIR</b> es una alternativa extremadamente flexible a BUSCARV. <code>=INDICE(matriz; numero_fila; [numero_columna])</code> devuelve el valor en la intersección de fila y columna. COINCIDIR devuelve la posición de un valor en un rango. Juntas: <code>=INDICE(rango_resultado; COINCIDIR(valor_buscado; rango_busqueda; 0; [num_columna])</code>.", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600", imageCaption: "Funcionamiento de INDICE y COINCIDIR" },
        { content: "Esta combinación permite búsquedas a la izquierda, derecha, y también bidireccionales (fila y columna dinámica). Es muy usada en tablas de resumen y dashboards porque es más eficiente que BUSCARV en grandes volúmenes de datos, ya que no requiere que toda la matriz sea reevaluada." }
      ],
      exercises: [
        { title: "Búsqueda bidireccional", description: "Tienes una matriz de ventas con productos en filas y meses en columnas. Usa INDICE y COINCIDIR para devolver la venta de un producto en un mes dado.", solutionHint: "=INDICE(matriz_ventas; COINCIDIR(producto; productos; 0); COINCIDIR(mes; meses; 0))" }
      ],
      quizQuestions: [
        { questionText: "¿Qué función devuelve la posición de un valor dentro de un rango?", options: ["COINCIDIR", "INDICE", "BUSCARV", "UBICAR"], correctAnswer: 0, explanation: "COINCIDIR devuelve un número de posición relativo." },
        { questionText: "¿INDICE sin especificar columna (solo con número de fila) devuelve?", options: ["Toda la fila", "El valor de la primera columna", "Error", "La matriz completa"], correctAnswer: 1, explanation: "Si solo se da número de fila, INDICE devuelve el valor de esa fila en la primera columna de la matriz." },
        { questionText: "¿Qué valor de coincidencia en COINCIDIR se usa para búsqueda exacta?", options: ["0", "1", "-1", "2"], correctAnswer: 0, explanation: "0 = coincidencia exacta." },
        { questionText: "¿Puede COINCIDIR buscar en filas y columnas?", options: ["Sí, con rango unidimensional", "No", "Solo con matrices", "Solo con BUSCARV"], correctAnswer: 0, explanation: "COINCIDIR trabaja con rangos de una sola fila o una sola columna." },
        { questionText: "¿Cuál es la principal ventaja de INDICE+COINCIDIR sobre BUSCARV?", options: ["Buscar a la izquierda", "Mayor velocidad en grandes datos", "Ambas", "Ninguna"], correctAnswer: 2, explanation: "Ambas son ventajas importantes." },
        { questionText: "¿Qué devuelve INDICE si usas 0 como número de fila?", options: ["Toda la columna", "Error", "El primer valor", "Nada"], correctAnswer: 0, explanation: "INDICE con fila 0 devuelve la referencia a toda la columna (si se usa en fórmulas)." },
        { questionText: "¿La combinación INDICE+COINCIDIR es sensible a mayúsculas?", options: ["Por defecto no; se puede hacer con EXACTO", "Sí", "Depende de la configuración", "Solo en COINCIDIR"], correctAnswer: 0, explanation: "No es sensible, pero se puede combinar con EXACTO para hacerla sensible." },
        { questionText: "¿Qué función de Excel 365 reemplaza a INDICE+COINCIDIR para búsquedas complejas?", options: ["XLOOKUP", "FILTRAR", "ORDENAR", "CONSULTAR"], correctAnswer: 0, explanation: "XLOOKUP es más simple y potente, pero la combinación sigue siendo útil para compatibilidad." }
      ]
    },
    {
      title: "2.5 Funciones de Búsqueda Anidadas y con Múltiples Criterios",
      description: "Combina condiciones lógicas con búsquedas.",
      paragraphs: [
        { content: "A veces necesitas buscar un valor basado en múltiples condiciones. Por ejemplo, buscar el precio de un producto en una tienda específica. Una técnica es concatenar los criterios en una columna auxiliar y usar BUSCARV o XLOOKUP sobre esa columna. Otra es usar <b>SUMAR.SI.CONJUNTO</b> si el resultado es numérico, o <b>INDICE y COINCIDIR</b> con combinaciones de Y lógica.", imageUrl: "https://images.unsplash.com/photo-1554224311-6f5e6e0de48b?w=600", imageCaption: "Búsqueda con múltiples criterios" },
        { content: "En versiones modernas, <b>XLOOKUP</b> puede usar múltiples rangos de búsqueda concatenados con el operador '&' dentro de un vector. También se puede usar <b>FILTRO</b> para devolver múltiples coincidencias. Exploraremos casos reales de análisis de ventas y RR.HH." }
      ],
      exercises: [
        { title: "Búsqueda con dos criterios", description: "Tabla con columnas: Producto, Región, Ventas. Usa una fórmula para encontrar las ventas de 'Producto A' en la 'Región Norte'.", solutionHint: "Con XLOOKUP: =XLOOKUP(1; (productos=\"A\")*(regiones=\"Norte\"); ventas). O con INDICE+COINCIDIR con 1 como valor buscado." }
      ],
      quizQuestions: [
        { questionText: "¿Cuál es una forma común de manejar múltiples criterios en búsquedas antiguas (pre-XLOOKUP)?", options: ["Columna auxiliar concatenada", "BUSCARV con dos tablas", "Funciones matriciales", "Macros"], correctAnswer: 0, explanation: "Concatenar los criterios en una columna y buscar sobre ella." },
        { questionText: "¿Qué función devuelve un conjunto de valores que cumplen una condición (útil para búsquedas múltiples)?", options: ["FILTRAR", "BUSCARX", "INDICE", "COINCIDIR"], correctAnswer: 0, explanation: "FILTER (FILTRAR) en Excel 365 devuelve todos los registros que cumplen condiciones." },
        { questionText: "¿Qué operador se usa para multiplicar matrices booleanas y convertir en 1/0?", options: ["* (asterisco)", "+", "Y", "O"], correctAnswer: 0, explanation: "Multiplicar condiciones convierte VERDADERO*VERDADERO=1, de lo contrario 0." },
        { questionText: "¿Cómo se puede usar XLOOKUP con múltiples criterios sin columna auxiliar?", options: ["Concatenando los rangos dentro de XLOOKUP", "No es posible", "Usando INDICE", "Con SUMAR.SI"], correctAnswer: 0, explanation: "=XLOOKUP(1; (rango1=crit1)*(rango2=crit2); resultado)" },
        { questionText: "¿Qué función es más eficiente para sumar valores con múltiples condiciones en lugar de buscarlos?", options: ["SUMAR.SI.CONJUNTO", "BUSCARV", "XLOOKUP", "CONTAR.SI"], correctAnswer: 0, explanation: "SUMAR.SI.CONJUNTO suma directamente, sin buscar." },
        { questionText: "¿Qué sucede si hay dos filas que cumplen los criterios en una búsqueda con multiplicación?", options: ["Solo devuelve la primera", "Devuelve un error", "Suma ambas", "Devuelve la última"], correctAnswer: 0, explanation: "XLOOKUP o INDICE+COINCIDIR devolverán la primera coincidencia." },
        { questionText: "¿Cómo se extraerían todas las coincidencias en lugar de solo la primera?", options: ["Usar FILTRAR", "Usar BUSCARV en modo matriz", "Usar DESREF", "No se puede"], correctAnswer: 0, explanation: "FILTRAR devuelve un arreglo con todas las coincidencias." },
        { questionText: "¿Qué función permite buscar en sentido horizontal con múltiples criterios?", options: ["XLOOKUP también funciona horizontalmente", "BUSCARH", "BUSCARV", "COINCIDIR"], correctAnswer: 0, explanation: "XLOOKUP puede trabajar con rangos fila o columna indistintamente." }
      ]
    },
    {
      title: "2.6 Validación de Datos Dinámica con Búsquedas",
      description: "Crea listas desplegables que dependen de otra selección.",
      paragraphs: [
        { content: "La validación de datos dinámica (también llamada listas dependientes o en cascada) permite que una lista desplegable muestre opciones basadas en lo que se selecciona en otra celda. Esto se logra combinando <b>COINCIDIR</b>, <b>INDICE</b> y rangos nombrados dinámicos. Por ejemplo, selecciona una categoría y luego el producto se limita a esa categoría.", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600", imageCaption: "Listas dependientes" },
        { content: "Otra técnica es usar <b>DESREF</b> para crear rangos nombrados que se redimensionan según la selección, pero es más compleja. En versiones modernas, <b>FILTRAR</b> dentro de la validación de datos (si se usa una lista en otra celda) simplifica el proceso. Veremos cómo implementar estos controles sin VBA." }
      ],
      exercises: [
        { title: "Lista desplegable dependiente", description: "Crea dos listas: una con países (México, España, Argentina) y otra que muestre ciudades solo del país seleccionado.", solutionHint: "Usa rangos nombrados: =INDIRECTO(país_seleccionado). Necesitas una tabla con columnas de ciudades por país y nombrar cada rango con el nombre del país." }
      ],
      quizQuestions: [
        { questionText: "¿Qué función se usa a menudo para crear un rango nombrado dinámico basado en texto?", options: ["INDIRECTO", "DIRECTO", "REFERENCIA", "NOMBRE"], correctAnswer: 0, explanation: "INDIRECTO convierte un texto en una referencia de rango." },
        { questionText: "¿Cómo se hace para que una lista desplegable muestre opciones únicas de una columna?", options: ["Validación de datos > Lista > rango con valores únicos (quizás con UNICOS)", "No se puede", "Con fórmulas matriciales", "Con código VBA"], correctAnswer: 0, explanation: "Puedes usar la función UNICOS (Excel 365) o una columna auxiliar para extraer valores únicos." },
        { questionText: "¿Qué limitación tiene usar INDIRECTO en validación de datos?", options: ["Solo funciona con rangos nombrados en el mismo libro", "No funciona con Excel Online", "Es lento", "Ninguna"], correctAnswer: 0, explanation: "INDIRECTO en validación no acepta referencias a otros libros abiertos." },
        { questionText: "¿Qué función de Excel 365 puede reemplazar los rangos nombrados dinámicos para listas dependientes?", options: ["FILTRAR", "ORDENAR", "SELECCIONAR", "UNICOS"], correctAnswer: 0, explanation: "FILTRAR dentro de una validación de datos (usando una celda auxiliar) puede generar opciones dinámicas." },
        { questionText: "¿Cuál es la forma más sencilla de crear listas dependientes sin rangos nombrados?", options: ["Usar tabla dinámica en la validación", "No es posible", "Con macros", "Con Power Query"], correctAnswer: 0, explanation: "Una tabla dinámica puede enlazarse a un rango que se actualice, pero es más complejo." },
        { questionText: "¿Qué sucede si el rango al que apunta INDIRECTO no existe?", options: ["Muestra error en validación", "La lista queda vacía", "No pasa nada", "Se desactiva la validación"], correctAnswer: 0, explanation: "La validación de datos mostrará un mensaje de error al seleccionar la celda." },
        { questionText: "¿Puede la validación de datos dinámica usar listas provenientes de otra hoja?", options: ["Sí, con INDIRECTO", "No", "Sí, solo si se nombra el rango", "Sí, pero solo en la misma hoja"], correctAnswer: 0, explanation: "Se puede usar un rango nombrado que haga referencia a otra hoja." },
        { questionText: "¿Qué precaución hay que tener al usar DESREF en rangos nombrados para validación?", options: ["Es volátil y puede afectar rendimiento", "No funciona", "Es más exacto", "Requiere macros"], correctAnswer: 0, explanation: "DESREF es volátil (recalcula en cada cambio) y puede ralentizar el libro." }
      ]
    }
  ]
};
// ==========================================================
// MÓDULO 3: Macros y VBA para Automatización de Tareas
// ==========================================================
const module3: ExcelModule = {
  order: 3,
  title: "Macros y VBA para Automatización de Tareas",
  description: "Automatiza procesos repetitivos, crea funciones personalizadas y controles de formulario.",
  coverImage: "/images/excel/module03_hero.png",
  durationHours: 7,
  units: [
    {
      title: "3.1 Grabación de Macros y Edición Básica",
      description: "Aprende a grabar acciones y entender el código generado.",
      paragraphs: [
        { content: "Una <b>macro</b> es una secuencia de instrucciones que automatiza tareas. La forma más sencilla de crear una es usar el grabador de macros (pestaña 'Desarrollador' > 'Grabar macro'). Realiza acciones en Excel y el grabador traduce a código VBA (Visual Basic for Applications). Es ideal para tareas repetitivas como formatear informes o exportar datos.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", imageCaption: "Grabación de macros" },
        { content: "Después de grabar, puedes editar la macro en el Editor de VBA (ALT+F11). Es importante entender conceptos como <b>Range</b>, <b>Selection</b>, <b>ActiveCell</b>, y cómo hacer que las macros sean relativas (grabar con 'Usar referencias relativas') para que funcionen en diferentes posiciones. También aprenderemos a asignar macros a botones." }
      ],
      exercises: [
        { title: "Grabar macro de formato", description: "Graba una macro que aplique formato a un rango (negrita, borde, color de fondo). Luego ejecútala en otro rango diferente.", solutionHint: "Activar 'Usar referencias relativas' antes de grabar. Haz clic en una celda, graba, aplica formato, detén. Luego selecciona otra celda y ejecuta." }
      ],
      quizQuestions: [
        { questionText: "¿Qué atajo abre el Editor de VBA?", options: ["ALT+F11", "CTRL+F11", "ALT+F8", "CTRL+F8"], correctAnswer: 0, explanation: "ALT+F11 abre el editor de VBA." },
        { questionText: "¿Qué opción permite que una macro grabada funcione en diferentes celdas de inicio?", options: ["Usar referencias relativas", "Referencias absolutas", "Grabar en modo debug", "No es posible"], correctAnswer: 0, explanation: "Con referencias relativas, la macro se basa en la celda activa al inicio." },
        { questionText: "¿Cuál es la extensión de un archivo de Excel con macros?", options: [".xlsm", ".xlsx", ".xlsb", ".xlam"], correctAnswer: 0, explanation: ".xlsm es el formato habilitado para macros." },
        { questionText: "¿Dónde se almacenan las macros grabadas por defecto?", options: ["En el libro actual", "En el libro Personal", "En un módulo global", "En el portapapeles"], correctAnswer: 0, explanation: "Si eliges 'Libro actual', la macro se guarda ahí." },
        { questionText: "¿Qué objeto en VBA representa una celda o rango?", options: ["Range", "Cell", "Worksheet", "Excel.Range"], correctAnswer: 0, explanation: "Range es el objeto para celdas/rangos." },
        { questionText: "¿Cómo se ejecuta una macro desde el teclado?", options: ["ALT+F8", "CTRL+C", "ALT+F11", "CTRL+F12"], correctAnswer: 0, explanation: "ALT+F8 abre el cuadro de diálogo 'Macro'." },
        { questionText: "¿Qué propiedad se usa para obtener el valor de una celda en VBA?", options: [".Value", ".Text", ".Formula", ".Content"], correctAnswer: 0, explanation: "Range(\"A1\").Value devuelve el valor." },
        { questionText: "¿Cómo se comenta una línea en VBA?", options: ["' (apóstrofe)", "//", "--", "#"], correctAnswer: 0, explanation: "El apóstrofe convierte la línea en comentario." }
      ]
    },
    {
      title: "3.2 Variables, Tipos de Datos y Estructuras de Control",
      description: "Domina los fundamentos de programación en VBA.",
      paragraphs: [
        { content: "Las <b>variables</b> almacenan datos temporalmente. Se declaran con <code>Dim nombre As Tipo</code>. Tipos comunes: Integer, Long, Double, String, Boolean, Date. Por ejemplo: <code>Dim contador As Integer</code>. También puedes usar <code>Variant</code> (tipo flexible pero menos eficiente).", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600", imageCaption: "Variables en VBA" },
        { content: "Las estructuras de control incluyen <b>If...Then...Else</b>, <b>Select Case</b>, bucles <b>For...Next</b>, <b>Do While...Loop</b>, y <b>For Each</b>. Por ejemplo, para recorrer todas las celdas de una columna: <code>For Each celda In Range(\"A1:A10\") ... Next celda</code>. Aprenderás a escribir código eficiente y evitar bucles infinitos." }
      ],
      exercises: [
        { title: "Contador de celdas vacías", description: "Escribe una macro que recorra un rango seleccionado por el usuario y cuente cuántas celdas están vacías. Muestra el resultado en un MsgBox.", solutionHint: "Usa InputBox para seleccionar rango, luego For Each cell in rango, If IsEmpty(cell) then contador = contador + 1." }
      ],
      quizQuestions: [
        { questionText: "¿Cuál es la sintaxis correcta para declarar una variable entera en VBA?", options: ["Dim i As Integer", "Integer i", "Dim i = Integer", "i As Integer"], correctAnswer: 0, explanation: "Dim nombre As Tipo es la forma correcta." },
        { questionText: "¿Qué bucle ejecuta el código mientras una condición sea verdadera, comprobando al inicio?", options: ["Do While...Loop", "Do Until...Loop con condition al final", "For...Next", "While...Wend con condición al final"], correctAnswer: 0, explanation: "Do While condición ... Loop evalúa al inicio." },
        { questionText: "¿Qué función muestra un cuadro de diálogo con un mensaje y botón Aceptar?", options: ["MsgBox", "InputBox", "MessageBox", "Dialog.Show"], correctAnswer: 0, explanation: "MsgBox es la función estándar." },
        { questionText: "¿Cómo se comenta un bloque de varias líneas en VBA? (editor)", options: ["Seleccionar y usar botón 'Comentar' o ' (apóstrofe) en cada línea", "/* ... */", "<!-- ... -->", "# ... #"], correctAnswer: 0, explanation: "VBA no tiene comentarios de bloque, se debe poner ' en cada línea." },
        { questionText: "¿Qué tipo de dato almacena un número decimal con alta precisión?", options: ["Double", "Integer", "Long", "Single"], correctAnswer: 0, explanation: "Double es de doble precisión." },
        { questionText: "¿Cuál es la estructura correcta de un If de una línea?", options: ["If condicion Then instruccion", "If condicion Then: instruccion", "If condicion Then instruccion End If", "If condicion Then {instruccion}"], correctAnswer: 0, explanation: "If cond Then accion (todo en una línea)." },
        { questionText: "¿Cómo sales de un bucle For antes de que termine?", options: ["Exit For", "Break", "End For", "GoTo Exit"], correctAnswer: 0, explanation: "Exit For sale inmediatamente del bucle." },
        { questionText: "¿Qué declaración evita el uso de variables no declaradas?", options: ["Option Explicit", "Option Base 1", "Option Compare Text", "Implicit Off"], correctAnswer: 0, explanation: "Option Explicit obliga a declarar variables." }
      ]
    },
    {
      title: "3.3 Rango, Celdas y Workbook Interacción",
      description: "Manipula celdas, hojas y libros mediante código.",
      paragraphs: [
        { content: "Para referirnos a celdas usamos <code>Range(\"A1\")</code> o <code>Cells(1,1)</code> (fila, columna). Para rangos más grandes: <code>Range(\"A1:B10\")</code>. Propiedades importantes: <code>.Value</code>, <code>.Formula</code>, <code>.Interior.Color</code>, <code>.Font.Bold</code>. Los métodos <code>.Copy</code> y <code>.Paste</code> permiten copiar.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", imageCaption: "Objetos Range en VBA" },
        { content: "Para trabajar con hojas: <code>Worksheets(\"Hoja1\")</code> o <code>Sheets(1)</code>. Con libros: <code>Workbooks(\"Libro1.xlsx\")</code> y <code>ThisWorkbook</code> (el libro que contiene la macro). Aprenderás a abrir libros, leer datos de ellos sin abrirlos (con GetObject) y cerrarlos. También verás cómo evitar el uso de Select y Active para hacer el código más rápido y robusto." }
      ],
      exercises: [
        { title: "Copiar datos entre libros", description: "Escribe una macro que copie los valores de A1:A10 del libro actual a un libro llamado 'Destino.xlsx' en la hoja 'Hoja1', a partir de B1.", solutionHint: "Abrir el libro destino con Workbooks.Open, asignar a variable, copiar con Range.Copy Destination:=..." }
      ],
      quizQuestions: [
        { questionText: "¿Cuál es la diferencia entre Range(\"A1\") y Cells(1,1)?", options: ["Son equivalentes", "Cells usa índices numéricos", "Range solo para letras", "Son diferentes"], correctAnswer: 0, explanation: "Ambos se refieren a la misma celda; Cells es útil en bucles." },
        { questionText: "¿Qué propiedad devuelve la fórmula de una celda como texto?", options: [".Formula", ".Value", ".Text", ".FormulaLocal"], correctAnswer: 0, explanation: ".Formula devuelve la fórmula." },
        { questionText: "¿Cómo te refieres a la hoja activa?", options: ["ActiveSheet", "CurrentSheet", "SheetActive", "ThisSheet"], correctAnswer: 0, explanation: "ActiveSheet es la hoja actual." },
        { questionText: "¿Qué representa ThisWorkbook?", options: ["El libro donde se ejecuta la macro", "El libro activo", "El primer libro abierto", "El libro personal"], correctAnswer: 0, explanation: "ThisWorkbook es el libro que contiene el código." },
        { questionText: "¿Qué objeto se usa para abrir un archivo de Excel?", options: ["Workbooks.Open", "File.Open", "Excel.Workbook.Open", "Application.OpenWorkbook"], correctAnswer: 0, explanation: "Workbooks.Open(\"ruta\") abre un libro." },
        { questionText: "¿Cuál es la forma más eficiente de asignar valores a un rango grande?", options: ["Asignar un array a Range.Value", "Asignar celda por celda", "Usar Copy/Paste", "Usar Select y ActiveCell"], correctAnswer: 0, explanation: "Range.Value = array es mucho más rápido." },
        { questionText: "¿Qué instrucción evita que la pantalla se actualice durante la ejecución de una macro?", options: ["Application.ScreenUpdating = False", "Application.EnableEvents = False", "DisplayAlerts = False", "ScreenUpdate = Off"], correctAnswer: 0, explanation: "Desactivar ScreenUpdating acelera macros." },
        { questionText: "¿Cómo se guarda el libro activo?", options: ["ActiveWorkbook.Save", "ThisWorkbook.Save", "Save", "Workbook.Save"], correctAnswer: 0, explanation: "ActiveWorkbook.Save guarda el libro activo." }
      ]
    },
    {
      title: "3.4 Funciones Personalizadas (UDF) y Eventos",
      description: "Crea tus propias funciones para usar en celdas y maneja eventos automáticos.",
      paragraphs: [
        { content: "Las <b>UDF (User Defined Functions)</b> son funciones creadas en VBA que se comportan como las nativas de Excel. Se declaran con <code>Function nombre(parametros) As Tipo</code>. Por ejemplo, una función que convierta grados Celsius a Fahrenheit. Las UDF se insertan en módulos estándar y se escriben en la celda como <code>=MiFuncion(A1)</code>.", imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600", imageCaption: "Funciones personalizadas" },
        { content: "Los <b>eventos</b> son macros que se ejecutan automáticamente cuando ocurre algo: abrir el libro (<code>Workbook_Open</code>), cambiar una celda (<code>Worksheet_Change</code>), etc. Los eventos se colocan en los módulos de objeto correspondientes (ThisWorkbook, hoja). Por ejemplo, puedes validar datos automáticamente o mostrar un mensaje al guardar." }
      ],
      exercises: [
        { title: "Crear función personalizada", description: "Crea una función llamada 'AñoFiscal' que reciba una fecha y devuelva el año fiscal (si la fecha es anterior a abril, el año fiscal es el año anterior, de lo contrario el mismo año). Ejemplo: 15/03/2023 ? 2022, 15/05/2023 ? 2023.", solutionHint: "Usa Month(fecha) y construir el año: = Year(fecha) - (Month(fecha) < 4)" }
      ],
      quizQuestions: [
        { questionText: "¿Dónde se escribe una UDF para que esté disponible en todas las hojas del libro?", options: ["Módulo estándar", "Módulo de hoja", "ThisWorkbook", "Clase"], correctAnswer: 0, explanation: "Las funciones públicas en módulos estándar son visibles en todas las celdas." },
        { questionText: "¿Qué evento se ejecuta justo antes de cerrar un libro?", options: ["Workbook_BeforeClose", "Workbook_Close", "Workbook_Deactivate", "Workbook_Shutdown"], correctAnswer: 0, explanation: "BeforeClose permite cancelar el cierre." },
        { questionText: "¿Una función UDF puede modificar el formato de otras celdas?", options: ["No, solo puede devolver un valor", "Sí, sin restricciones", "Sí, pero solo en la misma fila", "Depende de la configuración"], correctAnswer: 0, explanation: "Las UDF no pueden modificar el entorno, solo devolver valores." },
        { questionText: "¿Qué objeto guarda los eventos de hoja como SelectionChange?", options: ["Worksheet", "Workbook", "Application", "Range"], correctAnswer: 0, explanation: "Los eventos de hoja se colocan en el módulo de esa hoja." },
        { questionText: "¿Cómo se evita que un evento se dispare recursivamente al cambiar una celda?", options: ["Application.EnableEvents = False", "Desactivar la macro", "Usar un flag global", "No se puede"], correctAnswer: 0, explanation: "Deshabilitar EnableEvents previene la recursión." },
        { questionText: "¿Qué evento permite ejecutar código cada vez que se selecciona una celda diferente?", options: ["Worksheet_SelectionChange", "Worksheet_Change", "Worksheet_Activate", "Application.OnKey"], correctAnswer: 0, explanation: "SelectionChange se dispara al cambiar la selección." },
        { questionText: "¿Puede una UDF usar funciones de hoja de Excel como BUSCARV?", options: ["Sí, con Application.WorksheetFunction", "No", "Solo si se pasa por parámetro", "Depende de la versión"], correctAnswer: 0, explanation: "Application.WorksheetFunction.VLookup permite llamar funciones integradas." },
        { questionText: "¿Qué declaración hace que una UDF sea visible en el asistente de funciones?", options: ["Sin declaración especial, las públicas lo son", "Usar atributo Description", "Exportar como Add-In", "Registrar en el registro"], correctAnswer: 0, explanation: "Las Function públicas en módulos estándar aparecen en el asistente." }
      ]
    },
    {
      title: "3.5 Formularios (UserForms) y Controles",
      description: "Construye interfaces gráficas para capturar datos del usuario.",
      paragraphs: [
        { content: "Un <b>UserForm</b> es una ventana personalizable con controles como botones, cuadros de texto, listas desplegables, checkboxes, etc. Se inserta desde el editor VBA (Insertar > UserForm). Luego se agregan controles desde la caja de herramientas. Puedes programar eventos como <code>CommandButton_Click</code>.", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600", imageCaption: "Diseño de UserForm" },
        { content: "Los formularios permiten crear interfaces amigables para la entrada de datos, búsquedas o configuraciones. Veremos cómo mostrar un formulario con <code>UserForm1.Show</code>, recoger los datos, validarlos y transferirlos a las hojas. También cómo cerrarlo con <code>Unload Me</code>." }
      ],
      exercises: [
        { title: "Formulario de registro de empleados", description: "Crea un UserForm con campos: Nombre (TextBox), Edad (TextBox numérico), Departamento (ComboBox con opciones: Ventas, TI, RRHH), y un botón 'Guardar'. Al hacer clic, agrega los datos a la hoja 'Empleados' en la siguiente fila vacía.", solutionHint: "En el botón, usa siguiente fila vacía con Cells(Rows.Count,1).End(xlUp).Row + 1 y asigna valores." }
      ],
      quizQuestions: [
        { questionText: "¿Cómo se muestra un UserForm llamado 'frmDatos'?", options: ["frmDatos.Show", "Show frmDatos", "UserForm.Show frmDatos", "frmDatos.Visible = True"], correctAnswer: 0, explanation: "El método Show muestra el formulario." },
        { questionText: "¿Qué evento ocurre al hacer clic en un botón?", options: ["Click", "Command", "ButtonPress", "Action"], correctAnswer: 0, explanation: "El evento predeterminado es Click." },
        { questionText: "¿Cómo se cierra un UserForm desde el código?", options: ["Unload Me", "Me.Close", "UserForm.Terminate", "End"], correctAnswer: 0, explanation: "Unload Me descarga el formulario." },
        { questionText: "¿Qué propiedad de un TextBox contiene el texto ingresado?", options: [".Text", ".Value", ".Caption", ".Content"], correctAnswer: 0, explanation: "TextBox.Text (o .Value) da el texto." },
        { questionText: "¿Cómo se llena un ComboBox con valores (por ejemplo, lista de meses)?", options: ["ComboBox.AddItem \"Enero\"", "ComboBox.List = Array(\"Enero\",\"Febrero\")", "Ambas son válidas", "Solo AddItem"], correctAnswer: 2, explanation: "Ambos métodos funcionan; AddItem para añadir uno a uno, List para un array." },
        { questionText: "¿Qué control permite seleccionar una opción entre varias mutuamente excluyentes?", options: ["OptionButton", "CheckBox", "ToggleButton", "ComboBox"], correctAnswer: 0, explanation: "OptionButton (radio) es mutuamente excluyente dentro de un grupo." },
        { questionText: "¿Cómo se agrupan OptionButtons para que solo uno esté seleccionado?", options: ["Mediante un Frame", "Poniendo nombres iguales", "No se necesita", "Con un GroupObject"], correctAnswer: 0, explanation: "Frame agrupa controles, creando un conjunto exclusivo." },
        { questionText: "¿Qué evento se activa cuando se cambia el contenido de un TextBox?", options: ["Change", "Update", "AfterUpdate", "TextChanged"], correctAnswer: 0, explanation: "El evento Change se dispara con cada tecla." }
      ]
    },
    {
      title: "3.6 Depuración, Manejo de Errores y Buenas Prácticas",
      description: "Aprende a encontrar y corregir errores, y a escribir código robusto.",
      paragraphs: [
        { content: "El depurador de VBA permite ejecutar línea a línea (F8), establecer puntos de interrupción (F9), y ver el valor de las variables con 'Inspección rápida' o la ventana Locales. Las herramientas clave son: <b>Step Into (F8)</b>, <b>Step Over</b>, <b>Step Out</b>, <b> ventana Inmediato</b> (Ctrl+G) para probar comandos.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", imageCaption: "Depuración en VBA" },
        { content: "El manejo de errores se realiza con <code>On Error GoTo Etiqueta</code>. Así se capturan errores inesperados (por ejemplo, archivo no encontrado) y se muestra un mensaje amigable o se toma una acción alternativa. Las buenas prácticas incluyen: usar Option Explicit, comentar el código, evitar Select y Active, y liberar objetos (Set objeto = Nothing)." }
      ],
      exercises: [
        { title: "Macro con manejo de error", description: "Escribe una macro que intente abrir un archivo 'datos.xlsx' en la misma carpeta. Si el archivo no existe, muestra un mensaje y sale sin error.", solutionHint: "On Error GoTo ErrorHandler; Workbooks.Open; Exit Sub; ErrorHandler: MsgBox \"Archivo no encontrado\"." }
      ],
      quizQuestions: [
        { questionText: "¿Qué tecla ejecuta el código línea por línea en el depurador?", options: ["F8", "F5", "F9", "F10"], correctAnswer: 0, explanation: "F8 es Step Into." },
        { questionText: "¿Cómo se establece un punto de interrupción?", options: ["F9 o hacer clic en el margen izquierdo", "F5", "Insertar \"Stop\"", "Ambas son válidas"], correctAnswer: 3, explanation: "Tanto F9 como la instrucción Stop y el clic en margen establecen puntos de interrupción." },
        { questionText: "¿Qué sentencia captura cualquier error y salta a una línea de etiqueta?", options: ["On Error GoTo etiqueta", "On Error Resume Next", "On Error GoTo 0", "Error GoTo"], correctAnswer: 0, explanation: "On Error GoTo etiqueta deriva a la etiqueta cuando ocurre un error." },
        { questionText: "¿Qué hace 'On Error Resume Next'?", options: ["Ignora el error y continúa en la siguiente línea", "Captura el error", "Muestra un mensaje", "Detiene la ejecución"], correctAnswer: 0, explanation: "Resume Next omite el error y ejecuta la línea siguiente." },
        { questionText: "¿Cómo se muestra el valor de una variable durante la depuración?", options: ["Usando Debug.Print en ventana Inmediato", "MsgBox variable", "No se puede", "Con Watch"], correctAnswer: 0, explanation: "Debug.Print variable envía el valor a la ventana Inmediato." },
        { questionText: "¿Qué tecla permite añadir una expresión a la ventana de inspección (Watch)?", options: ["Shift+F9", "Ctrl+F9", "Alt+F9", "F9"], correctAnswer: 0, explanation: "Shift+F9 abre la ventana 'Agregar inspección'." },
        { questionText: "¿Qué sucede si no se maneja un error en VBA?", options: ["Muestra el mensaje de error estándar y detiene", "El código continúa", "Se cierra Excel", "Guarda automáticamente"], correctAnswer: 0, explanation: "Aparece el cuadro de error y la ejecución se detiene." },
        { questionText: "¿Cuál es la función que libera la memoria de un objeto?", options: ["Set objeto = Nothing", "FreeObject objeto", "Erase objeto", "Close objeto"], correctAnswer: 0, explanation: "Asignar Nothing libera la referencia." }
      ]
    }
  ]
};
// ==========================================================
// MÓDULO 4: Gráficos Dinámicos y Dashboards Interactivos
// ==========================================================
const module4: ExcelModule = {
  order: 4,
  title: "Gráficos Dinámicos y Dashboards Interactivos",
  description: "Crea visualizaciones profesionales que se actualizan automáticamente y paneles de control interactivos.",
  coverImage: "/images/excel/module04_hero.png",
  durationHours: 5,
  units: [
    {
      title: "4.1 Creación y Personalización de Gráficos Dinámicos",
      description: "Aprende a vincular gráficos a tablas dinámicas.",
      paragraphs: [
        { content: "Un <b>gráfico dinámico</b> es la representación gráfica de una tabla dinámica. Comparte los mismos filtros, segmentadores y líneas de tiempo. Para insertarlo, selecciona la tabla dinámica y ve a 'Analizar' > 'Gráfico dinámico'. Puedes elegir entre múltiples tipos: columnas, líneas, áreas, circulares, etc.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", imageCaption: "Gráfico dinámico y sus elementos" },
        { content: "La personalización es similar a los gráficos normales: puedes cambiar colores, agregar etiquetas de datos, títulos y ejes. La gran ventaja es que al filtrar la tabla dinámica (o usar segmentadores), el gráfico se actualiza automáticamente, ofreciendo una experiencia interactiva al usuario." }
      ],
      exercises: [
        { title: "Crear gráfico dinámico", description: "Con una tabla de ventas mensuales, crea una tabla dinámica que sume ventas por producto y un gráfico dinámico de columnas. Luego añade un segmentador por región que controle ambos.", solutionHint: "Inserta tabla dinámica, luego 'Gráfico dinámico'. Luego inserta segmentador desde 'Analizar' y conéctalo a la tabla y al gráfico." }
      ],
      quizQuestions: [
        { questionText: "¿Puede un gráfico dinámico existir sin una tabla dinámica asociada?", options: ["No", "Sí, como gráfico normal", "Sí, con rangos dinámicos", "Solo si se usa Power View"], correctAnswer: 0, explanation: "El gráfico dinámico es una representación de una tabla dinámica." },
        { questionText: "¿Qué sucede con un gráfico dinámico cuando aplicas un filtro en la tabla dinámica?", options: ["Se actualiza automáticamente", "Se borra", "Hay que refrescarlo manualmente", "Se desactiva"], correctAnswer: 0, explanation: "Ambos están vinculados, el gráfico refleja los filtros." },
        { questionText: "¿Se pueden cambiar los tipos de serie en un gráfico dinámico (ej. una serie como línea y otra como columna)?", options: ["No, no es posible", "Sí, seleccionando la serie y cambiando tipo", "Sí, pero solo versiones recientes", "Depende del tipo de datos"], correctAnswer: 0, explanation: "Los gráficos dinámicos no admiten tipos mixtos (combinados) a diferencia de los gráficos normales." },
        { questionText: "¿Qué elemento es exclusivo de los gráficos dinámicos y no de los normales?", options: ["Botones de campo dinámicos", "Etiquetas de datos", "Líneas de tendencia", "Ejes secundarios"], correctAnswer: 0, explanation: "Los gráficos dinámicos muestran botones para filtrar campos (como los de la tabla dinámica)." },
        { questionText: "¿Cómo se actualiza un gráfico dinámico cuando los datos fuente cambian (nuevas filas)?", options: ["Refrescando la tabla dinámica", "Automáticamente", "Rehaciendo el gráfico", "Cerrando y abriendo"], correctAnswer: 0, explanation: "Hay que refrescar la tabla dinámica (clic derecho > Actualizar) y el gráfico se actualiza." },
        { questionText: "¿Puede un mismo gráfico dinámico mostrar datos de dos tablas dinámicas diferentes?", options: ["No, solo una", "Sí, con Power Pivot", "Sí, con segmentadores comunes", "Solo si se combinan en una"], correctAnswer: 0, explanation: "Cada gráfico dinámico está vinculado a una sola tabla dinámica." },
        { questionText: "¿Qué tipo de gráfico no se recomienda para gráficos dinámicos con muchos datos?", options: ["Circular (tarta)", "Columnas", "Líneas", "Área"], correctAnswer: 0, explanation: "Los gráficos circulares se saturan con más de 5-6 categorías." },
        { questionText: "¿Puede exportarse un gráfico dinámico a PowerPoint manteniendo la interactividad?", options: ["No, se vuelve imagen estática", "Sí, como objeto OLE", "Sí, usando Power BI", "Solo a Word"], correctAnswer: 0, explanation: "Al copiar a PowerPoint se pierde la vinculación." }
      ]
    },
    {
      title: "4.2 Dashboards con Segmentadores y Líneas de Tiempo",
      description: "Crea paneles de control interactivos.",
      paragraphs: [
        { content: "Un <b>dashboard</b> es una página resumen que muestra indicadores clave y gráficos. La combinación de tablas dinámicas, gráficos dinámicos y segmentadores permite construir dashboards potentes sin necesidad de programación. Es importante organizar el diseño: colocar los segmentadores en la parte superior o lateral, y los gráficos en el área principal.", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600", imageCaption: "Dashboard corporativo" },
        { content: "Las <b>líneas de tiempo</b> son ideales para filtrar rangos de fechas. Puedes tener múltiples gráficos que respondan a una sola línea de tiempo. Además, puedes usar fórmulas y celdas con indicadores (KPI) que utilicen resultados de tablas dinámicas mediante funciones como GETPIVOTDATA." }
      ],
      exercises: [
        { title: "Construir un dashboard de ventas", description: "Crea un dashboard con: un gráfico de barras de ventas por producto, un gráfico de líneas de ventas por mes, un segmentador por región y una línea de tiempo por fecha. Todo debe filtrarse simultáneamente.", solutionHint: "Inserta una tabla dinámica y gráficos. Luego inserte segmentadores y línea de tiempo. Conecta todos los elementos (tablas y gráficos) en 'Conexiones de informe'." }
      ],
      quizQuestions: [
        { questionText: "¿Cuál es la función que extrae un valor específico de una tabla dinámica para usarlo en una celda?", options: ["GETPIVOTDATA", "BUSCARV", "SUMAR.SI", "INDICE"], correctAnswer: 0, explanation: "GETPIVOTDATA obtiene datos agregados de una tabla dinámica." },
        { questionText: "¿Se pueden conectar varios gráficos dinámicos a un mismo segmentador?", options: ["Sí", "No", "Sí, pero solo dos", "Solo si son del mismo tipo"], correctAnswer: 0, explanation: "En 'Conexiones de informe' puedes vincular todos los elementos que compartan el mismo campo." },
        { questionText: "¿Qué elemento permite filtrar por fechas con niveles jerárquicos (año, trimestre, mes)?", options: ["Línea de tiempo", "Segmentador de fechas", "Filtro avanzado", "Calendario"], correctAnswer: 0, explanation: "La línea de tiempo está diseñada para fechas con jerarquías." },
        { questionText: "¿Para qué sirve la opción 'Deshabilitar Guardar Origen de Datos' en una tabla dinámica?", options: ["Reducir tamaño del archivo", "Mejorar velocidad de filtrado", "Evitar actualizaciones", "Proteger datos"], correctAnswer: 0, explanation: "Evita guardar una copia de los datos origen, reduciendo el archivo." },
        { questionText: "¿Cómo se asegura que los segmentadores estén alineados visualmente en un dashboard?", options: ["Usando 'Alinear' en herramientas de segmentador", "Manual", "Con macros", "No se puede"], correctAnswer: 0, explanation: "Selecciona múltiples segmentadores y usa 'Alinear' en la pestaña 'Formato'." },
        { questionText: "¿Puede un dashboard incluir controles como botones de opción (radio buttons) para cambiar el cálculo (ej. ventas vs utilidad)?", options: ["Sí, usando formularios y fórmulas", "No, solo segmentadores", "Sí, con VBA", "Solo con Power Pivot"], correctAnswer: 0, explanation: "Se pueden usar controles de formulario (casillas, botones) vinculados a celdas que modifiquen el origen de la tabla dinámica o usen funciones SI." },
        { questionText: "¿Qué consideración de diseño es importante para dashboards profesionales?", options: ["Paleta de colores coherente", "Muchos gráficos diferentes", "Todo en una hoja", "Usar solo números"], correctAnswer: 0, explanation: "La coherencia visual mejora la legibilidad." },
        { questionText: "¿Qué recurso de Excel permite agregar indicadores de tendencia (semáforos) en un dashboard?", options: ["Formato condicional con iconos", "Gráficos sparkline", "Ambos", "Ninguno"], correctAnswer: 2, explanation: "Los iconos (semáforos, flechas) y los sparklines (minigráficos) son muy útiles." }
      ]
    },
    {
      title: "4.3 Gráficos Avanzados: Combinados, Sparklines y Mapas",
      description: "Visualizaciones profesionales más allá de lo básico.",
      paragraphs: [
        { content: "Los <b>gráficos combinados</b> (columna + línea) son muy usados para mostrar ventas y margen. Aunque los gráficos dinámicos no soportan tipos mixtos, puedes crear un gráfico normal sobre rangos dinámicos o usar Power Pivot para medidas DAX que permitan ejes duales.", imageUrl: "https://images.unsplash.com/photo-1554224311-6f5e6e0de48b?w=600", imageCaption: "Gráfico combinado columna y línea" },
        { content: "Los <b>sparklines</b> son minigráficos dentro de una celda. Ideales para dashboards compactos. Se insertan desde 'Insertar > Sparklines'. También los <b>mapas</b> (disponibles en versiones recientes) permiten visualizar datos geográficos a nivel de país, estado o código postal." }
      ],
      exercises: [
        { title: "Sparkline de tendencia", description: "En un dashboard, añade una columna con sparklines que muestren la tendencia mensual de ventas para cada producto.", solutionHint: "Usa el tipo 'Línea' y define el rango de datos mensuales. Luego ajusta los puntos altos y bajos." }
      ],
      quizQuestions: [
        { questionText: "¿Dónde se encuentran los sparklines?", options: ["Insertar > Sparklines", "Datos > Herramientas", "Formato > Minigráficos", "Revisar > Diagramas"], correctAnswer: 0, explanation: "La opción está en la pestaña Insertar." },
        { questionText: "¿Pueden los sparklines mostrar puntos máximos y mínimos?", options: ["Sí", "No", "Solo en versiones de pago", "Solo si se programa"], correctAnswer: 0, explanation: "En el diseño puedes marcas 'Punto alto' y 'Punto bajo'." },
        { questionText: "¿Qué tipo de gráfico combinado es ideal para mostrar volumen y porcentaje?", options: ["Columnas + Línea", "Área + Circular", "Barras + Radar", "Dispersion + Burbujas"], correctAnswer: 0, explanation: "Ejemplo: columnas para ventas, línea para margen %." },
        { questionText: "¿Qué requisito tienen los gráficos de mapa en Excel?", options: ["Conexión a internet para mapas", "Microsoft 365", "Power Map", "Complemento externo"], correctAnswer: 0, explanation: "Los mapas requieren Bing Maps, por lo que necesitas conexión." },
        { questionText: "¿Se pueden usar sparklines en una tabla dinámica?", options: ["Sí, si se copian como valores", "No, no se puede", "Sí, directamente", "Solo con Power Pivot"], correctAnswer: 0, explanation: "Los sparklines se basan en rangos; puedes copiar los resultados de una tabla dinámica a otro lugar y añadir sparklines." },
        { questionText: "¿Qué función permite crear un gráfico combinado con tabla dinámica sin Power Pivot?", options: ["No es posible directamente", "Usando rangos dinámicos con DESREF", "Sí, cambiando tipo de serie", "Con segmentadores"], correctAnswer: 0, explanation: "Los gráficos dinámicos no permiten tipos mixtos." },
        { questionText: "¿Cuántos tipos de sparklines hay?", options: ["3 (línea, columna, ganancias/pérdidas)", "1 (línea)", "2 (línea y columna)", "4"], correctAnswer: 0, explanation: "Línea, columna y de ganancia/pérdida (win-loss)." },
        { questionText: "¿Qué gráfico se recomienda para datos geográficos con intensidad de color?", options: ["Mapa de coropletas", "Diagrama de dispersión", "Gráfico de burbujas", "Mapa 3D"], correctAnswer: 0, explanation: "Los mapas con relleno por intensidad son ideales para densidades." }
      ]
    },
    {
      title: "4.4 Paneles de Control Actualizables con Power Query y Power Pivot",
      description: "Combina fuentes externas para dashboards dinámicos.",
      paragraphs: [
        { content: "Un dashboard potente se actualiza con nuevos datos automáticamente. Usando <b>Power Query</b> puedes importar datos de bases de datos, archivos CSV, carpetas, etc. y luego cargarlos al modelo de datos. Desde allí, creas tablas y gráficos dinámicos que se refrescan con un solo clic.", imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600", imageCaption: "Actualización automática con Power Query" },
        { content: "Las <b>medidas DAX</b> en Power Pivot permiten cálculos complejos (Ventas YTD, comparaciones interanuales) que se actualizan dinámicamente. Además, puedes programar la actualización de datos desde archivos externos mediante Power Automate o incluso VBA." }
      ],
      exercises: [
        { title: "Dashboard con actualización automática", description: "Crea una consulta Power Query que lea una carpeta con archivos CSV de ventas diarios. Carga al modelo de datos y construye un dashboard con ventas por producto y tendencia semanal.", solutionHint: "Power Query: Desde carpeta, combinar archivos. Luego cerrar y cargar a 'Solo conexión' y 'Agregar al modelo de datos'. Luego inserta tabla dinámica usando el modelo." }
      ],
      quizQuestions: [
        { questionText: "¿Dónde se encuentra Power Query en Excel?", options: ["Datos > Obtener datos", "Fórmulas > Power Pivot", "Insertar > Consultas", "Revisar > Power Query"], correctAnswer: 0, explanation: "Está en la pestaña Datos, grupo 'Obtener y transformar datos'." },
        { questionText: "¿Puede Power Query leer archivos de una carpeta y combinarlos automáticamente?", options: ["Sí", "No", "Solo archivos Excel", "Solo archivos CSV"], correctAnswer: 0, explanation: "Power Query puede leer y combinar cualquier tipo de archivo soportado." },
        { questionText: "¿Qué lenguaje usa Power Query para transformaciones?", options: ["M", "DAX", "SQL", "VBA"], correctAnswer: 0, explanation: "M es el lenguaje de fórmulas de Power Query." },
        { questionText: "¿Qué medida DAX calcularía las ventas acumuladas del año hasta la fecha?", options: ["TOTALYTD", "SUMX", "CALCULATE", "DATEADD"], correctAnswer: 0, explanation: "TOTALYTD(SUM(Ventas), TablaFecha[Fecha]) es la función específica." },
        { questionText: "¿Es necesario Power Pivot para usar Power Query?", options: ["No, son complementos independientes", "Sí, viene incluido", "Solo en versiones Pro", "Depende"], correctAnswer: 0, explanation: "Power Query puede cargar datos a una hoja sin usar el modelo de datos." },
        { questionText: "¿Cómo se actualizan los datos de un dashboard conectado a Power Query?", options: ["Datos > Actualizar todo", "Automáticamente", "Cerrando y abriendo", "Rehaciendo consultas"], correctAnswer: 0, explanation: "Puedes usar 'Actualizar todo' o programar actualizaciones." },
        { questionText: "¿Qué función DAX permite evaluar una expresión en un contexto modificado?", options: ["CALCULATE", "FILTER", "ALL", "SUMX"], correctAnswer: 0, explanation: "CALCULATE es la función más importante de DAX para cambiar filtros." },
        { questionText: "¿Puede un dashboard basado en Power Pivot manejar millones de filas?", options: ["Sí, gracias a la compresión en memoria", "No, solo 1 millón", "Sí, pero muy lento", "Depende de RAM"], correctAnswer: 0, explanation: "Power Pivot comprime datos y puede manejar cientos de millones de filas." }
      ]
    },
    {
      title: "4.5 Visualización Avanzada: Mapas 3D y Power View",
      description: "Explora datos en tres dimensiones y crea historias visuales.",
      paragraphs: [
        { content: "<b>Mapas 3D</b> (antes Power Map) permite crear visualizaciones geográficas con altura, tiempo y animación. Ideal para presentaciones ejecutivas. Puede mostrar burbujas, columnas, calor y representar cambios en el tiempo con un slider.", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600", imageCaption: "Mapa 3D de ventas por región" },
        { content: "<b>Power View</b> es un complemento para crear informes interactivos con gráficos, mapas y matrices. Aunque está siendo reemplazado por Power BI, aún está disponible en Excel 365. Veremos cómo crear tours animados y compartirlos como video." }
      ],
      exercises: [
        { title: "Crear un tour de ventas con Mapas 3D", description: "Usando datos de ventas con coordenadas geográficas, crea un mapa 3D que muestre las ventas por ciudad y cómo evolucionan en el tiempo (línea de tiempo animada).", solutionHint: "Insertar > Mapas 3D. Agrega ubicaciones (latitud/longitud o ciudad) y altura con las ventas. Luego añade línea de tiempo en 'Configuración de escena'." }
      ],
      quizQuestions: [
        { questionText: "¿Qué versión de Excel incluye Mapas 3D?", options: ["Excel 2016 y posteriores", "Excel 2010", "Excel 2007", "Todas"], correctAnswer: 0, explanation: "Mapas 3D se introdujo en Excel 2016." },
        { questionText: "¿Mapas 3D puede reproducir una animación en el tiempo?", options: ["Sí, con la línea de tiempo", "No", "Sí, pero en Power View", "Solo en PowerPoint"], correctAnswer: 0, explanation: "Puedes añadir una línea de tiempo y reproducir la evolución." },
        { questionText: "¿Power View se sigue desarrollando activamente?", options: ["No, fue reemplazado por Power BI", "Sí, cada año", "Solo para suscripciones", "Es parte de Power Pivot"], correctAnswer: 0, explanation: "Microsoft descontinuó Power View en favor de Power BI." },
        { questionText: "¿Qué tipo de gráfico en 3D permite Mapas 3D?", options: ["Burbujas, columnas, calor, región", "Solo burbujas", "Solo columnas", "Solo mapas de calor"], correctAnswer: 0, explanation: "Ofrece varios tipos de visualización." },
        { questionText: "¿Pueden los mapas 3D mostrar rutas o conexiones entre puntos?", options: ["Sí, con el tipo 'Gráfico de ruta'", "No", "Sí, usando líneas", "Solo en Power BI"], correctAnswer: 0, explanation: "Existe el tipo 'Gráfico de ruta' basado en origen y destino." },
        { questionText: "¿Qué se necesita para usar Mapas 3D correctamente?", options: ["Datos con coordenadas (lat/lon) o nombres geográficos reconocibles", "Solo nombres de países", "Solo códigos postales", "Internet permanente"], correctAnswer: 0, explanation: "Bing Maps interpreta nombres, pero es mejor tener coordenadas." },
        { questionText: "¿Puede exportarse un tour de Mapas 3D como video?", options: ["Sí, a MP4", "No, solo a imagen", "Sí, a AVI", "Solo a GIF"], correctAnswer: 0, explanation: "Puedes grabar el tour y exportar como video." },
        { questionText: "¿Power View está disponible en Excel 365?", options: ["Sí, pero oculto (requiere habilitar complemento)", "No", "Solo en versiones LTSC", "Sí, por defecto"], correctAnswer: 0, explanation: "Aún está disponible como complemento COM." }
      ]
    },
    {
      title: "4.6 Buenas Prácticas para Dashboards Profesionales",
      description: "Consejos de diseño y usabilidad.",
      paragraphs: [
        { content: "Un buen dashboard debe ser claro, conciso y enfocado. Algunas prácticas: usar una paleta de colores corporativa, ordenar los elementos por importancia de arriba hacia abajo y de izquierda a derecha, minimizar texto, usar títulos descriptivos y evitar desorden visual. También es crucial validar los datos y documentar las fuentes.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", imageCaption: "Ejemplo de dashboard limpio" },
        { content: "Otras recomendaciones: usar formatos condicionales para destacar anomalías (rojo/verde), agregar controles de selección (segmentadores) en lugar de muchos filtros manuales, y probar el dashboard con usuarios finales. Además, conviene proteger las áreas de fórmulas y habilitar solo las celdas interactivas." }
      ],
      exercises: [
        { title: "Rediseñar un dashboard mejorándolo", description: "Toma un dashboard existente (puede ser uno que hayas creado) y aplícale mejoras: paleta de colores consistente, alineación, eliminar elementos redundantes y añadir título y fuente.", solutionHint: "Usa los principios de diseño: contraste, repetición, alineación y proximidad. Asegura que el dashboard sea comprensible en 10 segundos." }
      ],
      quizQuestions: [
        { questionText: "¿Cuál es la regla de ordenamiento visual recomendada?", options: ["De arriba a abajo y de izquierda a derecha", "De abajo arriba", "Centrado", "Distribución aleatoria"], correctAnswer: 0, explanation: "Siguiendo la dirección natural de lectura occidental." },
        { questionText: "¿Qué es un KPI en un dashboard?", options: ["Indicador clave de rendimiento", "Gráfico de barras", "Filtro interactivo", "Tabla dinámica"], correctAnswer: 0, explanation: "KPI = Key Performance Indicator." },
        { questionText: "¿Por qué es importante la consistencia en los colores?", options: ["Facilita interpretación", "Es más bonito", "Ahorra tinta", "Acelera cálculos"], correctAnswer: 0, explanation: "Colores consistentes ayudan a asociar medidas rápidamente." },
        { questionText: "¿Qué herramienta de Excel permite crear un botón para actualizar datos sin usar VBA?", options: ["Actualizar todo (datos)", "Macro", "Power Query automático", "No existe"], correctAnswer: 0, explanation: "En la pestaña Datos > Actualizar todo, o añadir a la barra de acceso rápido." },
        { questionText: "¿Es recomendable incluir muchos gráficos circulares en un dashboard?", options: ["No, ocupan espacio y comparan mal", "Sí, son muy claros", "Sí, para porcentajes", "Depende"], correctAnswer: 0, explanation: "Los gráficos circulares solo funcionan con pocas categorías; las barras son mejores." },
        { questionText: "¿Qué se debe documentar en un dashboard?", options: ["Fuente de datos y fecha de actualización", "Solo el título", "Las fórmulas", "Nada"], correctAnswer: 0, explanation: "Es importante para auditoría y confianza." },
        { questionText: "¿Cómo se protege un dashboard para que los usuarios no modifiquen fórmulas?", options: ["Proteger hoja", "Ocultar columnas", "Usar contraseña en libro", "Hacer solo imagen"], correctAnswer: 0, explanation: "Revisar > Proteger hoja permite bloquear celdas con fórmulas." },
        { questionText: "¿Qué tipo de gráfico es ideal para comparar varias categorías en un dashboard compacto?", options: ["Gráfico de barras", "Circular", "Radar", "Dispersion"], correctAnswer: 0, explanation: "Las barras son fáciles de comparar y ocupan poco espacio." }
      ]
    }
  ]
};
// ==========================================================
// MÓDULO 5: Power Query para Limpieza y Transformación de Datos
// ==========================================================
const module5: ExcelModule = {
  order: 5,
  title: "Power Query para Limpieza y Transformación de Datos",
  description: "Automatiza la preparación de datos desde múltiples orígenes.",
  coverImage: "/images/excel/module05_hero.png",
  durationHours: 6,
  units: [
    {
      title: "5.1 Introducción a Power Query (Obtener y Transformar)",
      description: "Conoce el editor de consultas.",
      paragraphs: [
        { content: "<b>Power Query</b> es una herramienta de ETL (Extraer, Transformar, Cargar) integrada en Excel. Permite conectarse a diversas fuentes: archivos, bases de datos, web, etc., y aplicar transformaciones de limpieza (eliminar filas vacías, cambiar tipos, combinar columnas, etc.) sin alterar los datos originales.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", imageCaption: "Editor de Power Query" },
        { content: "El editor de Power Query registra cada paso de transformación en el lenguaje M. Esto hace que el proceso sea reproducible y actualizable con un clic. Aprenderemos a importar datos, usar la interfaz gráfica y entender el código M generado." }
      ],
      exercises: [
        { title: "Primera consulta", description: "Importa un archivo CSV con datos de ventas sucios (con filas vacías y formatos incorrectos). Limpia: elimina filas vacías, cambia formato de fecha y convierte números a decimal.", solutionHint: "Usa 'Eliminar filas vacías' y 'Cambiar tipo de datos'." }
      ],
      quizQuestions: [
        { questionText: "¿Dónde se inicia Power Query en Excel?", options: ["Datos > Obtener datos", "Insertar > Power Query", "Fórmulas > Editor", "Revisar > Herramientas"], correctAnswer: 0, explanation: "En la pestaña Datos, grupo 'Obtener y transformar datos'." },
        { questionText: "¿Qué lenguaje de fórmulas utiliza Power Query?", options: ["M", "DAX", "SQL", "VBA"], correctAnswer: 0, explanation: "M es el lenguaje funcional de Power Query." },
        { questionText: "¿Power Query puede combinar varios archivos de una carpeta?", options: ["Sí", "No", "Solo archivos Excel", "Solo CSV"], correctAnswer: 0, explanation: "La opción 'Combinar archivos' lo permite." },
        { questionText: "¿Qué paso se usa para dividir una columna por un delimitador?", options: ["Dividir columna", "Separar", "Extraer", "Particionar"], correctAnswer: 0, explanation: "Hay opción 'Dividir columna' por delimitador." },
        { questionText: "¿Los datos transformados por Power Query se almacenan en?", options: ["En la memoria (modelo de datos) o en una hoja", "Solo en la hoja", "Solo en Power Pivot", "En un archivo externo"], correctAnswer: 0, explanation: "Puedes cargar a una tabla de hoja o al modelo de datos." },
        { questionText: "¿Es posible programar la actualización automática de una consulta Power Query?", options: ["Sí, con Power Automate o VBA", "No", "Sí, desde opciones de consulta", "Solo con macros"], correctAnswer: 0, explanation: "Se puede automatizar con Power Automate o VBA." },
        { questionText: "¿Qué función M se usa para leer un archivo CSV?", options: ["Csv.Document", "Excel.Workbook", "File.Contents", "Text.From"], correctAnswer: 0, explanation: "Csv.Document procesa archivos CSV." },
        { questionText: "¿Qué significa 'ETL'?", options: ["Extract, Transform, Load", "Excel Table Link", "Extraer, Truncar, Listar", "Evaluar, Transformar, Limpiar"], correctAnswer: 0, explanation: "Proceso de extracción, transformación y carga." }
      ]
    },
    {
      title: "5.2 Transformaciones Esenciales: Filtros, Columnas Condicionales y Agrupación",
      description: "Limpieza avanzada de datos.",
      paragraphs: [
        { content: "Power Query permite filtrar filas por condiciones (mayor que, contiene texto), agregar <b>columnas condicionales</b> (similares a un SI anidado) y <b>agrupar filas</b> para obtener sumas, promedios, etc. También se pueden reemplazar valores, cambiar mayúsculas/minúsculas, y eliminar duplicados.", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600", imageCaption: "Columnas condicionales" },
        { content: "Estas transformaciones son la base de la limpieza de datos. Por ejemplo, puedes agrupar ventas por cliente y calcular el total, luego unir esa tabla con otra. Aprenderemos a construir flujos de trabajo complejos paso a paso." }
      ],
      exercises: [
        { title: "Agrupar y resumir", description: "Con una tabla de transacciones (cliente, producto, monto), agrupa por cliente y calcula el monto total y el número de compras.", solutionHint: "Usar 'Agrupar por' > operaciones: Suma de monto y Recuento de filas." }
      ],
      quizQuestions: [
        { questionText: "¿Qué operación permite añadir una columna basada en condiciones IF?", options: ["Columna condicional", "Columna personalizada", "Columna de ejemplo", "Columna calculada"], correctAnswer: 0, explanation: "Existe 'Columna condicional' en la pestaña 'Agregar columna'." },
        { questionText: "¿Cómo se eliminan filas duplicadas en Power Query?", options: ["Eliminar duplicados", "Quitar filas duplicadas", "Agrupar y contar", "Filtro avanzado"], correctAnswer: 0, explanation: "Bastante intuitivo: botón 'Eliminar duplicados'." },
        { questionText: "¿Qué tipo de agrupación permite obtener el primer valor de un grupo?", options: ["Todas las operaciones de agregación", "Solo suma", "Solo media", "Solo mínimo"], correctAnswer: 0, explanation: "En 'Agrupar por', operación 'Todo' o personalizado con M." },
        { questionText: "¿Se pueden aplicar transformaciones sobre una columna sin crear una nueva?", options: ["Sí, usando 'Transformar'", "No, siempre se añade", "Sí, con 'Reemplazar'", "Depende"], correctAnswer: 0, explanation: "La pestaña 'Transformar' modifica la columna existente." },
        { questionText: "¿Qué transformación usarías para estandarizar nombres propios a mayúscula primera letra?", options: ["Formato > Cada palabra mayúscula", "Mayúsculas a primera", "Capitalizar", "Upper"], correctAnswer: 0, explanation: "Power Query tiene 'Capitalizar cada palabra'." },
        { questionText: "¿Puede Power Query rellenar valores nulos con el valor anterior?", options: ["Sí, con 'Rellenar' > 'Hacia abajo'", "No", "Sí, con 'Completar'", "Solo con columnas condicionales"], correctAnswer: 0, explanation: "La opción 'Rellenar' permite copiar valores hacia abajo o arriba." },
        { questionText: "¿Qué significa 'Promover filas como encabezados'?", options: ["Usar la primera fila como nombres de columna", "Mover filas arriba", "Formatear como título", "Ordenar"], correctAnswer: 0, explanation: "Es una transformación común para datos importados sin encabezados." },
        { questionText: "¿Qué hace 'Unpivot' (despivotar) en Power Query?", options: ["Convierte columnas en filas", "Convierte filas en columnas", "Agrupa datos", "Elimina columnas"], correctAnswer: 0, explanation: "Unpivot normaliza tablas cruzadas." }
      ]
    },
    {
      title: "5.3 Combinación y Unión de Tablas (Merge y Append)",
      description: "Integra datos de diferentes fuentes.",
      paragraphs: [
        { content: "<b>Append</b> apila tablas (como un UNIR TODO), mientras que <b>Merge</b> combina tablas mediante una clave (como un JOIN). Con Merge puedes hacer left, inner, full outer, etc. Es fundamental para enriquecer datos.", imageUrl: "https://images.unsplash.com/photo-1554224311-6f5e6e0de48b?w=600", imageCaption: "Merge en Power Query" },
        { content: "Por ejemplo, puedes tener una tabla de ventas y otra de productos; usando Merge por ProductID, obtienes las ventas con el nombre del producto. El resultado se expande para mostrar las columnas deseadas." }
      ],
      exercises: [
        { title: "Merge de ventas y productos", description: "Con dos tablas: Ventas (ProductID, Cantidad) y Productos (ProductID, Nombre). Realiza un left join para obtener un informe con el nombre del producto.", solutionHint: "Usar 'Combinar consultas' (Merge) seleccionando Left Outer." }
      ],
      quizQuestions: [
        { questionText: "¿Qué operación apila filas de dos tablas una debajo de otra?", options: ["Append", "Merge", "Union", "Combine"], correctAnswer: 0, explanation: "Append (anexar) apila filas." },
        { questionText: "¿Qué tipo de join es el predeterminado en Merge?", options: ["Left outer", "Inner", "Right outer", "Full outer"], correctAnswer: 0, explanation: "Left outer (mantener todas las filas de la tabla izquierda)." },
        { questionText: "¿Cómo se expanden las columnas después de un Merge?", options: ["Clic en icono expandir (flechas)", "Se expanden automáticamente", "Usando 'Agregar columna'", "Con una fórmula M"], correctAnswer: 0, explanation: "Aparece un icono de dos flechas para seleccionar qué columnas traer." },
        { questionText: "¿Qué función M se usa para un Merge?", options: ["Table.NestedJoin", "Table.Join", "Table.Combine", "Table.Merge"], correctAnswer: 1, explanation: "Table.Join es la función subyacente." }
      ]
    },
    {
      title: "5.4 Consulta de Parámetros y Actualización Programada",
      description: "Haz tus consultas dinámicas y automatizadas.",
      paragraphs: [
        { content: "Los parámetros en Power Query permiten cambiar el origen de datos sin editar la consulta. Por ejemplo, una ruta de archivo como parámetro. También puedes conectar Power Query a Power Automate para actualizar consultas periódicamente.", imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600", imageCaption: "Parámetros dinámicos" },
        { content: "Aprenderemos a crear un parámetro, usarlo en la consulta y a configurar actualizaciones programadas desde Excel o mediante conectores." }
      ],
      exercises: [
        { title: "Parámetros de ruta", description: "Crea un parámetro 'RutaArchivo' y modifica la consulta para leer de esa ruta. Luego cambia el valor del parámetro y refresca.", solutionHint: "Administrar parámetros > Nuevo parámetro; luego en la consulta usar = Csv.Document(File.Contents(RutaArchivo))." }
      ],
      quizQuestions: [
        { questionText: "¿Dónde se crean parámetros en Power Query?", options: ["Administrar parámetros", "Editor avanzado", "Pestaña Agregar columna", "Transformar"], correctAnswer: 0, explanation: "En la pestaña 'Inicio' o 'Datos' > 'Administrar parámetros'." },
        { questionText: "¿Se puede actualizar una consulta Power Query desde un flujo de Power Automate?", options: ["Sí", "No", "Solo con VBA", "Solo manual"], correctAnswer: 0, explanation: "Power Automate tiene acción para refrescar consultas." },
        { questionText: "¿Qué extensión tiene un archivo de parámetros de Power Query?", options: [".pq", ".json", ".param", ".m"], correctAnswer: 0, explanation: "Los parámetros se guardan en archivos .pq cuando se exportan." }
      ]
    }
  ]
};
// ==========================================================
// MÓDULO 6: Análisis de Datos con Power Pivot y DAX
// ==========================================================
const module6: ExcelModule = {
  order: 6,
  title: "Análisis de Datos con Power Pivot y DAX",
  description: "Modela datos, crea relaciones jerárquicas y medidas complejas.",
  coverImage: "/images/excel/module06_hero.png",
  durationHours: 6,
  units: [
    {
      title: "6.1 Introducción al Modelo de Datos y Power Pivot",
      description: "Crea relaciones entre tablas.",
      paragraphs: [
        { content: "El <b>Modelo de Datos</b> de Excel permite conectar múltiples tablas mediante relaciones (uno a muchos, muchos a muchos). <b>Power Pivot</b> es la interfaz para gestionar el modelo, crear medidas y trabajar con grandes volúmenes de datos (hasta millones de filas).", imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600", imageCaption: "Diagrama de relaciones en Power Pivot" },
        { content: "Para acceder a Power Pivot, ve a 'Administrar' en la pestaña Power Pivot (si no está visible, actívala desde Complementos COM). Aquí puedes importar datos, crear relaciones jerárquicas y ver el modelo." }
      ],
      exercises: [
        { title: "Crear relación", description: "Importa las tablas Ventas y Productos, crea una relación por ProductoID. Luego crea una tabla dinámica que muestre ventas por categoría de producto.", solutionHint: "Power Pivot > Administrar > Vista Diagrama. Arrastra ProductoID de Ventas al campo de Productos." }
      ],
      quizQuestions: [
        { questionText: "¿Dónde se activa Power Pivot?", options: ["Archivo > Opciones > Complementos > COM", "Insertar > Power Pivot", "Datos > Power Pivot", "Revisar > Complementos"], correctAnswer: 0, explanation: "En Opciones de Excel, Complementos COM, añadir Microsoft Power Pivot for Excel." },
        { questionText: "¿Puede Power Pivot manejar más de 1 millón de filas?", options: ["Sí, hasta cientos de millones", "No, el límite es 1,048,576", "Sí, pero muy lento", "Depende de la RAM"], correctAnswer: 0, explanation: "Power Pivot usa compresión columnar y puede manejar grandes volúmenes." },
        { questionText: "¿Qué es una relación 'uno a muchos'?", options: ["Un registro de una tabla tiene muchos en otra", "Uno a uno", "Muchos a muchos", "Jerarquía"], correctAnswer: 0, explanation: "Ej: un cliente (uno) tiene muchas ventas (muchos)." },
        { questionText: "¿Cuál es el lenguaje de Power Pivot?", options: ["DAX", "M", "SQL", "MDX"], correctAnswer: 0, explanation: "Data Analysis Expressions." },
        { questionText: "¿Se pueden crear jerarquías (año > trimestre > mes) en Power Pivot?", options: ["Sí", "No", "Solo en tablas dinámicas", "Solo en Power Query"], correctAnswer: 0, explanation: "Se crean arrastrando niveles en la tabla de fechas." },
        { questionText: "¿Qué es una medida en Power Pivot?", options: ["Una fórmula que resume datos", "Una columna adicional", "Un filtro", "Un tipo de dato"], correctAnswer: 0, explanation: "Las medidas son agregaciones dinámicas (ej. suma, promedio) que se evalúan en contexto." },
        { questionText: "¿Power Pivot requiere licencia adicional?", options: ["No, está incluido en versiones Pro/365", "Sí, es de pago", "Solo en Excel 2016", "Solo para empresas"], correctAnswer: 0, explanation: "Está disponible en Excel 2016 Professional Plus y Microsoft 365." },
        { questionText: "¿Qué ventana permite ver el diagrama de relaciones?", options: ["Vista Diagrama", "Vista Datos", "Vista Avanzada", "Panel de relaciones"], correctAnswer: 0, explanation: "En Power Pivot > Vista Diagrama." }
      ]
    },
    {
      title: "6.2 Medidas Básicas en DAX: SUM, AVERAGE, COUNT",
      description: "Crea medidas rápidas.",
      paragraphs: [
        { content: "Las medidas se escriben en DAX. Por ejemplo: <code>Ventas Totales = SUM(Ventas[Importe])</code>. Puedes usar funciones como <code>AVERAGE</code>, <code>COUNT</code>, <code>MIN</code>, <code>MAX</code>. Las medidas se guardan en el modelo y se pueden usar en tablas dinámicas.", imageUrl: "https://images.unsplash.com/photo-1554224311-6f5e6e0de48b?w=600", imageCaption: "Creación de medidas" },
        { content: "Las 'medidas rápidas' generan código DAX automáticamente (por ejemplo, total acumulado, diferencia con año anterior). Aprenderemos a escribirlas manualmente para tener control." }
      ],
      exercises: [
        { title: "Medida de promedio", description: "Crea una medida que calcule el promedio de ventas por producto.", solutionHint: "AVERAGE(Ventas[Importe])" }
      ],
      quizQuestions: [
        { questionText: "¿Dónde se crean las medidas en Power Pivot?", options: ["Pestaña Inicio > Medida", "Pestaña Diseño > Medida", "Vista Datos > Nueva medida", "Vista Diagrama > Medida"], correctAnswer: 0, explanation: "En la pestaña Inicio, grupo 'Cálculos' > 'Medida'." },
        { questionText: "¿Qué función DAX cuenta filas de una tabla incluyendo las que tienen valores en blanco?", options: ["COUNTA", "COUNT", "COUNTROWS", "DISTINCTCOUNT"], correctAnswer: 2, explanation: "COUNTROWS cuenta todas las filas de una tabla." },
        { questionText: "¿Cuál es la sintaxis correcta para una suma en DAX?", options: ["SUM(Tabla[Columna])", "SUM(Columna, Tabla)", "TOTAL(Tabla[Columna])", "ADD(Tabla, Columna)"], correctAnswer: 0, explanation: "La función SUM requiere una columna." },
        { questionText: "¿Qué hace la función DISTINCTCOUNT?", options: ["Cuenta valores únicos", "Cuenta valores distintos ignorando nulos", "Cuenta todas las filas", "Cuenta no nulos"], correctAnswer: 0, explanation: "Devuelve el número de valores distintos." },
        { questionText: "¿Puedes usar medidas en otras medidas?", options: ["Sí", "No", "Solo si son del mismo tipo", "Solo con CALCULATE"], correctAnswer: 0, explanation: "Una medida puede referenciar a otra medida." },
        { questionText: "¿Cómo se referencia una medida en una tabla dinámica?", options: ["Por su nombre", "Por su fórmula", "Por su ubicación", "Por su tipo"], correctAnswer: 0, explanation: "Las medidas aparecen en la lista de campos." },
        { questionText: "¿Qué función devuelve el promedio de una columna numérica?", options: ["AVERAGE", "MEAN", "AVG", "PROMEDIO"], correctAnswer: 0, explanation: "AVERAGE es la función DAX." },
        { questionText: "¿Dónde se guardan las medidas creadas en Power Pivot?", options: ["En el modelo de datos", "En la hoja de Excel", "En un archivo externo", "En la memoria temporal"], correctAnswer: 0, explanation: "Son parte del modelo." }
      ]
    },
    {
      title: "6.3 Funciones DAX Clave: CALCULATE, FILTER, ALL",
      description: "Modifica el contexto de filtro.",
      paragraphs: [
        { content: "<b>CALCULATE</b> es la función más poderosa de DAX. Evalúa una expresión en un contexto modificado. Por ejemplo: <code>Ventas 2023 = CALCULATE(SUM(Ventas[Importe]), YEAR(Ventas[Fecha])=2023)</code>. <b>FILTER</b> devuelve una tabla filtrada, y <b>ALL</b> elimina filtros.", imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600", imageCaption: "CALCULATE en acción" },
        { content: "Estas funciones permiten crear medidas como porcentajes del total, ventas acumuladas, comparaciones con períodos anteriores, etc. Son fundamentales para análisis avanzados." }
      ],
      exercises: [
        { title: "Porcentaje del total", description: "Crea una medida que muestre el porcentaje de ventas de cada producto sobre el total general, usando ALL.", solutionHint: "DIVIDE(SUM(Ventas[Importe]), CALCULATE(SUM(Ventas[Importe]), ALL(Ventas)))" }
      ],
      quizQuestions: [
        { questionText: "¿Qué hace CALCULATE?", options: ["Modifica el contexto de filtro", "Calcula una suma", "Filtra una tabla", "Agrupa datos"], correctAnswer: 0, explanation: "Evalúa una expresión con filtros modificados." },
        { questionText: "¿Cuál es el resultado de ALL(Tabla)?", options: ["Elimina todos los filtros de la tabla", "Devuelve todas las filas", "Filtra al contrario", "Agrupa"], correctAnswer: 0, explanation: "ALL se usa para ignorar filtros." },
        { questionText: "¿Qué función devuelve una tabla filtrada?", options: ["FILTER", "CALCULATE", "ALL", "SELECTEDVALUE"], correctAnswer: 0, explanation: "FILTER devuelve una tabla." },
        { questionText: "¿Cómo se escribe una condición en CALCULATE para filtrar por un año?", options: ["YEAR(Fecha)=2023", "[Fecha]=2023", "Fecha = 2023", "FILTER(Fecha, Year=2023)"], correctAnswer: 0, explanation: "Las condiciones se expresan como expresiones booleanas." },
        { questionText: "¿Qué función podría usar para evitar división por cero?", options: ["DIVIDE", "IF", "CALCULATE", "ALL"], correctAnswer: 0, explanation: "DIVIDE maneja automáticamente el denominador cero." },
        { questionText: "¿Cómo se calcula el total sin considerar ningún filtro?", options: ["CALCULATE(SUM(Ventas[Importe]), ALL(Ventas))", "SUM(Ventas[Importe])", "CALCULATE(SUM(Ventas[Importe]), ALLSELECTED(Ventas))", "TOTAL"], correctAnswer: 0, explanation: "ALL elimina todos los filtros." },
        { questionText: "¿Para qué se usa FILTER dentro de CALCULATE?", options: ["Para aplicar condiciones complejas", "Para sumar", "Para contar", "Para agrupar"], correctAnswer: 0, explanation: "FILTER permite condiciones más flexibles." },
        { questionText: "¿Qué función DAX es similar a un SWITCH en programación?", options: ["SWITCH", "IF", "CALCULATE", "SELECTEDVALUE"], correctAnswer: 0, explanation: "SWITCH evalúa múltiples condiciones." }
      ]
    },
    {
      title: "6.4 Inteligencia de Tiempo: YTD, QTD, MTD",
      description: "Análisis de períodos acumulados.",
      paragraphs: [
        { content: "Las funciones de inteligencia de tiempo requieren una tabla de fechas marcada como tal. <b>TOTALYTD</b> calcula el total del año hasta la fecha. Ejemplo: <code>Ventas YTD = TOTALYTD(SUM(Ventas[Importe]), 'Fecha'[Fecha])</code>. También existen <b>TOTALQTD</b> y <b>TOTALMTD</b>.", imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600", imageCaption: "Ventas YTD" },
        { content: "Otras funciones útiles: <b>DATESYTD</b>, <b>PREVIOUSMONTH</b>, <b>SAMEPERIODLASTYEAR</b>. Exploraremos cómo crear comparaciones interanuales y períodos móviles." }
      ],
      exercises: [
        { title: "Ventas acumuladas año", description: "Crea una medida YTD para ventas.", solutionHint: "TOTALYTD(SUM(Ventas[Importe]), 'Calendario'[Fecha])" }
      ],
      quizQuestions: [
        { questionText: "¿Qué se requiere para usar funciones de inteligencia de tiempo?", options: ["Una tabla de fechas marcada", "Una columna numérica", "Una tabla de ventas", "Una medida"], correctAnswer: 0, explanation: "La tabla de fechas debe estar marcada como tabla de fechas." },
        { questionText: "¿Qué calcula TOTALYTD?", options: ["Acumulado del año hasta la fecha", "Total del año", "Promedio del año", "Máximo del año"], correctAnswer: 0, explanation: "Year-To-Date." },
        { questionText: "¿Cómo se comparan las ventas con el año anterior?", options: ["CALCULATE(SUM(...), SAMEPERIODLASTYEAR(...))", "PREVIOUSYEAR", "DATEADD", "YOY"], correctAnswer: 0, explanation: "SAMEPERIODLASTYEAR desplaza un año." },
        { questionText: "¿Qué función devuelve las fechas del mes hasta la fecha actual?", options: ["DATESMTD", "TOTALMTD", "MTD", "DATESYTD"], correctAnswer: 1, explanation: "TOTALMTD es la función de acumulado mensual, pero DATESMTD devuelve el conjunto." },
        { questionText: "¿Qué hace la función DATEADD?", options: ["Desplaza fechas hacia adelante o atrás", "Suma días", "Crea una fecha", "Extrae el año"], correctAnswer: 0, explanation: "Desplaza un número de intervalos (días, meses, años)." },
        { questionText: "¿Es obligatorio tener una tabla de fechas separada?", options: ["Recomendado", "No", "Sí, siempre", "Depende"], correctAnswer: 0, explanation: "Es una buena práctica tener una tabla de calendario independiente." },
        { questionText: "¿Qué función calcularía el trimestre anterior?", options: ["PREVIOUSQUARTER", "DATEADD(..., -1, QUARTER)", "CALCULATE(..., PREVIOUSQUARTER)", "TOTALQTD"], correctAnswer: 2, explanation: "PREVIOUSQUARTER es una función de inteligencia de tiempo." },
        { questionText: "¿Cómo se marca una tabla como tabla de fechas?", options: ["Diseño > Marcar como tabla de fechas", "Pestaña Power Pivot > Marcador", "Propiedades > Calendario", "Vista Diagrama > Fechas"], correctAnswer: 0, explanation: "En Power Pivot, seleccionas la tabla y luego 'Marcar como tabla de fechas'." }
      ]
    }
  ]
};
// ==========================================================
// MÓDULO 7: Colaboración Empresarial y Automatización con Power Automate
// ==========================================================
const module7: ExcelModule = {
  order: 7,
  title: "Colaboración Empresarial y Automatización con Power Automate",
  description: "Comparte dashboards y automatiza flujos de trabajo.",
  coverImage: "/images/excel/module07_hero.png",
  durationHours: 5,
  units: [
    {
      title: "7.1 Compartición y Coautoría en Excel Online",
      description: "Trabajo colaborativo en tiempo real.",
      paragraphs: [
        { content: "Excel Online permite la coautoría: varias personas pueden editar el mismo libro simultáneamente, viendo los cambios en tiempo real. Para compartir, usa 'Compartir' en OneDrive o SharePoint. También puedes crear <b>vínculos de solo lectura o edición</b>.", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600", imageCaption: "Colaboración en Excel" },
        { content: "Además, puedes usar <b>comentarios</b> y <b>@menciones</b> para notificar a compañeros. La <b>coautoría</b> funciona también con tablas dinámicas y gráficos, aunque con algunas limitaciones. Aprenderemos a gestionar conflictos." }
      ],
      exercises: [
        { title: "Compartir libro", description: "Sube un libro a OneDrive, comparte con un compañero y editen simultáneamente, agregando comentarios.", solutionHint: "Usa la opción 'Compartir' en Excel Online y envía el enlace con permisos de edición." }
      ],
      quizQuestions: [
        { questionText: "¿Dónde se debe guardar un libro para coautoría?", options: ["OneDrive o SharePoint", "Disco local", "USB", "Google Drive"], correctAnswer: 0, explanation: "La coautoría requiere almacenamiento en la nube de Microsoft." },
        { questionText: "¿Cuántas personas pueden editar a la vez en Excel Online?", options: ["Hasta 99", "2", "Ilimitado", "10"], correctAnswer: 0, explanation: "El límite práctico es 99 coautores simultáneos." },
        { questionText: "¿Qué símbolo se usa para mencionar a otro usuario en un comentario?", options: ["@", "#", "&", "+"], correctAnswer: 0, explanation: "Escribe @ seguido del nombre del colaborador." },
        { questionText: "¿Pierdo alguna funcionalidad en coautoría con tablas dinámicas?", options: ["Las tablas dinámicas son de solo lectura en coautoría", "Funcionan igual", "No se pueden insertar", "Solo se pueden ver"], correctAnswer: 0, explanation: "En coautoría, las tablas dinámicas no se pueden modificar, solo refrescar." },
        { questionText: "¿Qué es Power Automate?", options: ["Herramienta para automatizar flujos entre apps", "Complemento de Excel", "Un tipo de macro", "Un lenguaje de programación"], correctAnswer: 0, explanation: "Power Automate (antes Flow) permite automatizar tareas entre servicios." },
        { questionText: "¿Puede Power Automate enviar un correo cuando alguien modifique un Excel?", options: ["Sí", "No", "Solo con licencia de pago", "Solo con Outlook"], correctAnswer: 0, explanation: "Hay plantillas de flujo para notificaciones por cambios." },
        { questionText: "¿Qué flujo de Power Automate podría programar una actualización de consulta Power Query diaria?", options: ["Programar actualización de datos", "No es posible", "Manual", "Con script"], correctAnswer: 0, explanation: "Existe acción 'Actualizar libro de Excel' en flujos." },
        { questionText: "¿Power Automate está incluido en todas las suscripciones de Microsoft 365?", options: ["Sí, básico incluido; avanzado requiere licencia", "No, solo pago", "Solo en plan empresarial", "Sí, completo"], correctAnswer: 0, explanation: "Tiene capacidades limitadas gratis." }
      ]
    },
    {
      title: "7.2 Automatización de Tareas Repetitivas con Power Automate",
      description: "Conecta Excel con otras aplicaciones.",
      paragraphs: [
        { content: "Power Automate permite crear flujos que se disparan al modificar un archivo en OneDrive, al llegar un correo, etc. Por ejemplo, puedes automatizar el envío de informes, la copia de datos entre archivos o la notificación de cambios.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", imageCaption: "Flujo en Power Automate" },
        { content: "Veremos cómo crear un flujo que, cuando se agregue una fila a una tabla de Excel, guarde esos datos en una base de datos o envíe un correo. También cómo extraer datos de un Excel y generar PDFs automáticamente." }
      ],
      exercises: [
        { title: "Flujo de notificación", description: "Crea un flujo que envíe un correo al administrador cuando un usuario complete un quiz en Excel.", solutionHint: "Usa el disparador 'When an item is created' (de SharePoint o Excel Online) y la acción 'Send an email'." }
      ],
      quizQuestions: [
        { questionText: "¿Qué disparador se usa para iniciar un flujo al modificar un archivo en OneDrive?", options: ["When a file is created or modified", "When an email arrives", "Recurrence", "HTTP request"], correctAnswer: 0, explanation: "Es el disparador específico." },
        { questionText: "¿Se puede conectar Power Automate con bases de datos SQL?", options: ["Sí", "No", "Solo con SQL Server", "Solo con Azure SQL"], correctAnswer: 0, explanation: "Hay conectores para SQL Server, MySQL, PostgreSQL, etc." },
        { questionText: "¿Qué acción permite extraer datos de una tabla de Excel?", options: ["List rows present in a table", "Get file content", "Create table", "Update row"], correctAnswer: 0, explanation: "List rows present in a table es la acción estándar." },
        { questionText: "¿Power Automate puede ejecutar scripts de Office Scripts?", options: ["Sí", "No", "Solo en versión de pago", "Solo con API"], correctAnswer: 0, explanation: "Existe la acción 'Run script'." }
      ]
    },
    {
      title: "7.3 Integración con Power BI y Sharepoint",
      description: "Crea informes dinámicos actualizados automáticamente.",
      paragraphs: [
        { content: "Puedes conectar Power Automate con Power BI para actualizar datasets, enviar alertas o exportar informes. Por ejemplo, un flujo que cuando se agreguen ventas en Excel, actualice un dashboard en Power BI.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", imageCaption: "Integración con Power BI" },
        { content: "También con SharePoint: puedes guardar archivos, crear elementos en listas, etc. La integración con SharePoint es muy útil para flujos de aprobación y gestión documental." }
      ],
      exercises: [
        { title: "Actualizar dataset de Power BI", description: "Crea un flujo que actualice un dataset de Power BI cada vez que se modifique un archivo Excel.", solutionHint: "Usa el conector 'Power BI' > 'Refresh a dataset'." }
      ],
      quizQuestions: [
        { questionText: "¿Qué acción de Power BI permite actualizar un dataset?", options: ["Refresh a dataset", "Export to file", "Create dashboard", "Get dataset"], correctAnswer: 0, explanation: "Es la acción estándar." },
        { questionText: "¿Power Automate puede crear elementos en listas de SharePoint?", options: ["Sí", "No", "Solo en librerías", "Solo con API"], correctAnswer: 0, explanation: "Hay acción 'Create item'." },
        { questionText: "¿Qué conector permite gestionar archivos en OneDrive?", options: ["OneDrive for Business", "SharePoint", "File System", "Google Drive"], correctAnswer: 0, explanation: "OneDrive for Business es el conector adecuado." }
      ]
    },
    {
      title: "7.4 Buenas Prácticas y Seguridad en Power Automate",
      description: "Mantén tus flujos seguros y eficientes.",
      paragraphs: [
        { content: "Para flujos de producción, usa conexiones con cuentas de servicio, maneja errores con 'Configure run after', y evita bucles infinitos. También puedes usar entornos para separar desarrollo, pruebas y producción.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", imageCaption: "Seguridad en flujos" },
        { content: "Otras prácticas: desactiva flujos no utilizados, documenta los flujos complejos, y usa variables para valores reutilizables. Además, revisa los límites de ejecución (2 minutos para solicitudes HTTP, 30 días para flujos largos)." }
      ],
      exercises: [
        { title: "Manejo de errores", description: "Agrega configuración 'Configure run after' a una acción para que envíe un correo si falla.", solutionHint: "En la acción, ve a 'Configure run after' y marca 'has failed'. Luego agrega acción 'Send an email'." }
      ],
      quizQuestions: [
        { questionText: "¿Cuánto tiempo máximo puede ejecutarse un flujo bajo demanda?", options: ["30 días", "2 minutos", "24 horas", "1 hora"], correctAnswer: 0, explanation: "Los flujos pueden ejecutarse hasta 30 días." },
        { questionText: "¿Qué es un 'entorno' en Power Automate?", options: ["Un contenedor para flujos y conexiones", "Un tipo de licencia", "Una región geográfica", "Un conector"], correctAnswer: 0, explanation: "Los entornos aíslan recursos." },
        { questionText: "¿Cómo se maneja un error en una acción?", options: ["Configure run after", "Try-Catch", "On error", "Retry policy"], correctAnswer: 0, explanation: "Es la configuración nativa en Power Automate." }
      ]
    }
  ]
};

// ==========================================================
// EXPORTACIÓN DE TODOS LOS MÓDULOS
// ==========================================================
const excelModulesData: ExcelModule[] = [
  module1,
  module2,
  module3,
  module4,
  module5,
  module6,
  module7,
];
// ==================================================
// FUNCIÓN PRINCIPAL DE SEED (añadir al final del archivo)
// ==================================================
async function seed() {
  const db = getDb();
  console.log('🌱 Sembrando base de datos...');

  // Limpiar tablas (opcional)
  await db.delete(excelQuizQuestions);
  await db.delete(excelExercises);
  await db.delete(excelParagraphs);
  await db.delete(excelUnits);
  await db.delete(excelModules);
  await db.delete(excelUserProgress);
  await db.delete(excelAccessRequests);
  await db.delete(accessKeys);
  await db.delete(users);

  // Crear usuario administrador
  const adminPassword = await bcrypt.hash('admin123', 10);
  const [admin] = await db.insert(users).values({
    email: 'admin@excelacademy.com',
    name: 'Administrador',
    password: adminPassword,
    role: 'admin',
    isExcelAuthorized: true,
  }).$returningId();
  console.log('✅ Administrador creado con email: admin@excelacademy.com, clave: admin123');

  // Crear clave de acceso de demostración
const demoKey = 'DEMO1234';
await db.insert(accessKeys).values({
  keyCode: demoKey,
  type: 'individual',
  institution_name: 'Usuario Demo',
  used: false,
});
  console.log(`✅ Clave demo generada: ${demoKey}`);

  // Insertar módulos, unidades, párrafos, ejercicios y preguntas
  for (const mod of excelModulesData) {
    console.log(`📚 Insertando módulo: ${mod.title}`);
    const [modRes] = await db.insert(excelModules).values({
      order: mod.order,
      title: mod.title,
      description: mod.description,
      coverImage: mod.coverImage,
      durationHours: mod.durationHours,
    }).$returningId();
    const moduleId = modRes.id;

    for (let ui = 0; ui < mod.units.length; ui++) {
      const unit = mod.units[ui];
      console.log(`   └─ Unidad ${ui + 1}: ${unit.title}`);
      const [unitRes] = await db.insert(excelUnits).values({
        moduleId,
        order: ui,
        title: unit.title,
        description: unit.description || null,
      }).$returningId();
      const unitId = unitRes.id;

      for (let pi = 0; pi < unit.paragraphs.length; pi++) {
        const p = unit.paragraphs[pi];
        await db.insert(excelParagraphs).values({
          unitId,
          order: pi,
          content: p.content,
          imageUrl: p.imageUrl || null,
          imageCaption: p.imageCaption || null,
        });
      }
      for (let ei = 0; ei < unit.exercises.length; ei++) {
        const e = unit.exercises[ei];
        await db.insert(excelExercises).values({
          unitId,
          order: ei,
          title: e.title,
          description: e.description,
          solutionHint: e.solutionHint || null,
        });
      }
      for (let qi = 0; qi < unit.quizQuestions.length; qi++) {
        const q = unit.quizQuestions[qi];
        await db.insert(excelQuizQuestions).values({
          unitId,
          order: qi,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || null,
        });
      }
    }
  }

  console.log('🎉 Seed completado con éxito.');
}

seed().catch(console.error);