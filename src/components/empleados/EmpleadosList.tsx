import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  puesto: string;
  departamento: string;
  fecha_contratacion: string;
  salario?: string;
  telefono?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

const EmpleadosList = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const { data, error } = await supabase.from("empleados").select("*");

        if (error) {
          throw error;
        }

        if (data) {
          // Convert salario from number to string in each record
          const empleadosWithStringProperties: Empleado[] = data.map(item => ({
            ...item,
            salario: item.salario?.toString() || "",
          }));
          
          setEmpleados(empleadosWithStringProperties);
        }
      } catch (error: any) {
        console.error("Error al cargar empleados:", error);
        toast("Error", {
          description: `Error al cargar empleados: ${error.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleados();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      try {
        const { error } = await supabase.from("empleados").delete().eq("id", id);

        if (error) {
          throw error;
        }

        setEmpleados((prev) => prev.filter((emp) => emp.id !== id));
        toast("Eliminado", {
          description: "El empleado ha sido eliminado correctamente",
        });
      } catch (error: any) {
        console.error("Error al eliminar empleado:", error);
        toast("Error", {
          description: `Error al eliminar empleado: ${error.message}`,
        });
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Empleados</h1>
        <Button onClick={() => navigate("/empleados/nuevo")}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Empleado
        </Button>
      </div>

      {loading ? (
        <p>Cargando empleados...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salario
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
              {empleados.map((empleado) => (
                <tr key={empleado.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {empleado.nombre} {empleado.apellido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{empleado.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{empleado.puesto}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{empleado.departamento}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {empleado.salario ? `€${empleado.salario}` : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/empleados/editar/${empleado.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(empleado.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmpleadosList;
