
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, DollarSign, EuroIcon } from "lucide-react";
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
  tipo_salario?: "mensual" | "anual";
  moneda?: "ARS" | "USD";
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
            tipo_salario: item.tipo_salario || "mensual",
            moneda: item.moneda || "ARS",
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
  
  const formatoSalario = (empleado: Empleado) => {
    if (!empleado.salario) return "N/A";
    
    const monedaSymbol = empleado.moneda === "USD" ? "$" : "ARS $";
    const tipo = empleado.tipo_salario === "mensual" ? "/mes" : "/año";
    
    return `${monedaSymbol}${empleado.salario}${tipo}`;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold aurora-text">Empleados</h1>
        <Button 
          onClick={() => navigate("/empleados/nuevo")}
          className="bg-aurora-blue hover:bg-blue-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Añadir Empleado
        </Button>
      </div>

      {loading ? (
        <div className="aurora-glass p-8 flex justify-center items-center">
          <p className="text-white">Cargando empleados...</p>
        </div>
      ) : (
        <div className="overflow-x-auto aurora-glass p-3 rounded-lg">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-black/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Puesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Salario
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {empleados.map((empleado) => (
                <tr key={empleado.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {empleado.nombre} {empleado.apellido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/80">{empleado.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/80">{empleado.puesto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/80">{empleado.departamento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/80">
                    <div className="flex items-center">
                      {empleado.moneda === "USD" ? (
                        <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                      ) : (
                        <EuroIcon className="h-4 w-4 mr-1 text-blue-400" />
                      )}
                      {formatoSalario(empleado)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/empleados/editar/${empleado.id}`)}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(empleado.id)}
                      className="text-white/70 hover:text-white hover:bg-white/10"
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
