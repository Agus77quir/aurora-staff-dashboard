
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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
}

const EmpleadosList = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const { data, error } = await supabase
          .from('empleados')
          .select('*')
          .order('apellido', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setEmpleados(data || []);
      } catch (error: any) {
        toast.error(`Error al cargar empleados: ${error.message}`);
        console.error("Error al cargar empleados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpleados();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      try {
        const { error } = await supabase
          .from('empleados')
          .delete()
          .eq('id', id);
        
        if (error) {
          throw error;
        }
        
        setEmpleados(empleados.filter((empleado) => empleado.id !== id));
        toast.success("Empleado eliminado correctamente");
      } catch (error: any) {
        toast.error(`Error al eliminar empleado: ${error.message}`);
        console.error("Error al eliminar empleado:", error);
      }
    }
  };

  const empleadosFiltrados = empleados.filter(
    (empleado) =>
      empleado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      empleado.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      empleado.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      empleado.puesto.toLowerCase().includes(busqueda.toLowerCase()) ||
      empleado.departamento.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="glass-card p-8 flex justify-center items-center">
        <div className="animate-pulse">Cargando empleados...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Lista de Empleados</h2>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Buscar empleados..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="rounded-md border border-white/10 bg-secondary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button asChild>
            <Link to="/empleados/nuevo">Nuevo Empleado</Link>
          </Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-secondary/50">
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Puesto</TableHead>
              <TableHead className="hidden lg:table-cell">Departamento</TableHead>
              <TableHead className="hidden lg:table-cell">Fecha Contratación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empleadosFiltrados.length > 0 ? (
              empleadosFiltrados.map((empleado) => (
                <TableRow key={empleado.id} className="hover:bg-secondary/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{`${empleado.nombre} ${empleado.apellido}`}</p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {empleado.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {empleado.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {empleado.puesto}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {empleado.departamento}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {new Date(empleado.fecha_contratacion).toLocaleDateString("es-ES")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/empleados/editar/${empleado.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(empleado.id)}
                        disabled={empleado.user_id !== user?.id}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No se encontraron empleados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmpleadosList;
