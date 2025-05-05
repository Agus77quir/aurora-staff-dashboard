
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EmpleadoForm from "@/components/empleados/EmpleadoForm";

const EditarEmpleado = () => {
  return (
    <DashboardLayout>
      <div className="aurora-glow">
        <h2 className="text-3xl font-bold mb-6 aurora-text">Editar Empleado</h2>
        <EmpleadoForm tipo="editar" />
      </div>
    </DashboardLayout>
  );
};

export default EditarEmpleado;
