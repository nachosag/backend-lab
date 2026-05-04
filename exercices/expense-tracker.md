# Expense Tracker

Construí una aplicación simple de **seguimiento de gastos** para gestionar tus finanzas.

En este proyecto vas a construir una aplicación sencilla para registrar y administrar gastos. La aplicación debe permitir a los usuarios **agregar, eliminar y visualizar gastos**, además de proporcionar **resúmenes de los gastos registrados**.

## Requisitos

La aplicación debe ejecutarse desde la **línea de comandos** y debe incluir las siguientes funcionalidades:

* Los usuarios pueden **agregar un gasto** con una descripción y un monto.
* Los usuarios pueden **actualizar un gasto**.
* Los usuarios pueden **eliminar un gasto**.
* Los usuarios pueden **ver todos los gastos**.
* Los usuarios pueden **ver un resumen de todos los gastos**.
* Los usuarios pueden **ver un resumen de gastos para un mes específico (del año actual)**.

## Funcionalidades adicionales (opcionales)

Podés agregar características adicionales como:

* Agregar **categorías de gasto** y permitir filtrar gastos por categoría.
* Permitir que los usuarios definan un **presupuesto mensual** y mostrar una advertencia cuando se exceda.
* Permitir **exportar los gastos a un archivo CSV**.

## Comandos y salida esperada

```bash
$ expense-tracker add --description "Lunch" --amount 20
# Expense added successfully (ID: 1)
$ expense-tracker add --description "Dinner" --amount 10
# Expense added successfully (ID: 2)
$ expense-tracker list
# ID  Date       Description  Amount
# 1   2024-08-06  Lunch        $20
# 2   2024-08-06  Dinner       $10
$ expense-tracker summary
# Total expenses: $30
$ expense-tracker delete --id 2
# Expense deleted successfully
$ expense-tracker summary
# Total expenses: $20
$ expense-tracker summary --month 8
# Total expenses for August: $20
```

## Implementación

Podés implementar la aplicación usando **cualquier lenguaje de programación**. Algunas sugerencias:

* Utilizar un módulo para **parsear argumentos de línea de comandos** (por ejemplo `argparse` en Python o `commander` en Node.js).
* Utilizar un **archivo de texto simple** para almacenar los gastos. Podés usar **JSON, CSV u otro formato**.
* Agregar **manejo de errores** para entradas inválidas o casos límite (por ejemplo: montos negativos, IDs inexistentes, etc.).
* Utilizar **funciones para modularizar el código**, facilitando pruebas y mantenimiento.

Este proyecto es una buena forma de practicar **lógica de programación**, interacción con el **sistema de archivos** desde una aplicación CLI y gestión de **datos estructurados**.

