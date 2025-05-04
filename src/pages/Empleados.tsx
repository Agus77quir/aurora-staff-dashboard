
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EmpleadosList from "@/components/empleados/EmpleadosList";

const Empleados = () => {
  return (
    <DashboardLayout>
      <EmpleadosList />
    </DashboardLayout>
  );
};

export default Empleados;
