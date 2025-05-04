
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EmpleadoForm from "@/components/empleados/EmpleadoForm";

const NuevoEmpleado = () => {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold mb-6">Crear Nuevo Empleado</h2>
        <EmpleadoForm tipo="crear" />
      </div>
    </DashboardLayout>
  );
};

export default NuevoEmpleado;
