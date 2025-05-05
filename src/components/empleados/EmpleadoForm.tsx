
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EmpleadoFormProps {
  tipo: "crear" | "editar";
}

interface Empleado {
  id?: string;
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

const empleadoInicial: Empleado = {
  nombre: "",
  apellido: "",
  email: "",
  puesto: "",
  departamento: "",
  fecha_contratacion: new Date().toISOString().split("T")[0],
  salario: "",
  telefono: "",
};

const departamentos = [
  "Tecnología",
  "Diseño",
  "Ventas",
  "Marketing",
  "Recursos Humanos",
  "Administración",
  "Finanzas",
  "Atención al Cliente",
];

const EmpleadoForm: React.FC<EmpleadoFormProps> = ({ tipo }) => {
  const [empleado, setEmpleado] = useState<Empleado>(empleadoInicial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    // Si es modo edición y tenemos un ID, cargamos los datos del empleado
    if (tipo === "editar" && id) {
      const fetchEmpleado = async () => {
        try {
          const { data, error } = await supabase
            .from('empleados')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) {
            throw error;
          }
          
          if (data) {
            setEmpleado(data);
          } else {
            toast({
              title: "Error",
              description: "Empleado no encontrado",
              variant: "destructive",
            });
            navigate("/empleados");
          }
        } catch (error: any) {
          console.error("Error al cargar empleado:", error);
          toast({
            title: "Error",
            description: `Error al cargar empleado: ${error.message}`,
            variant: "destructive",
          });
          navigate("/empleados");
        }
      };

      fetchEmpleado();
    }
  }, [tipo, id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEmpleado((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEmpleado((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      toast({
        title: "Error",
        description: "Debe iniciar sesión para realizar esta acción",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let result;
      
      if (tipo === "crear") {
        // Crear nuevo empleado
        result = await supabase
          .from('empleados')
          .insert({
            ...empleado,
            user_id: user.id,
            fecha_contratacion: empleado.fecha_contratacion,
            salario: empleado.salario ? parseFloat(empleado.salario) : null
          });
      } else {
        // Actualizar empleado existente
        result = await supabase
          .from('empleados')
          .update({
            ...empleado,
            fecha_contratacion: empleado.fecha_contratacion,
            salario: empleado.salario ? parseFloat(empleado.salario) : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      }
      
      if (result.error) {
        throw result.error;
      }

      toast({
        title: tipo === "crear" ? "Empleado creado" : "Empleado actualizado",
        description: `${empleado.nombre} ${empleado.apellido} ha sido ${
          tipo === "crear" ? "añadido" : "actualizado"
        } correctamente.`,
      });

      navigate("/empleados");
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: `Ha ocurrido un error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            value={empleado.nombre}
            onChange={handleChange}
            required
            className="mt-1"
            placeholder="Nombre del empleado"
          />
        </div>

        <div>
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            name="apellido"
            value={empleado.apellido}
            onChange={handleChange}
            required
            className="mt-1"
            placeholder="Apellido del empleado"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={empleado.email}
            onChange={handleChange}
            required
            className="mt-1"
            placeholder="email@ejemplo.com"
          />
        </div>

        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            value={empleado.telefono || ""}
            onChange={handleChange}
            className="mt-1"
            placeholder="Número de teléfono"
          />
        </div>

        <div>
          <Label htmlFor="puesto">Puesto</Label>
          <Input
            id="puesto"
            name="puesto"
            value={empleado.puesto}
            onChange={handleChange}
            required
            className="mt-1"
            placeholder="Cargo del empleado"
          />
        </div>

        <div>
          <Label htmlFor="departamento">Departamento</Label>
          <Select
            value={empleado.departamento}
            onValueChange={(value) => handleSelectChange("departamento", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Seleccionar departamento" />
            </SelectTrigger>
            <SelectContent>
              {departamentos.map((dep) => (
                <SelectItem key={dep} value={dep}>
                  {dep}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fecha_contratacion">Fecha de contratación</Label>
          <Input
            id="fecha_contratacion"
            name="fecha_contratacion"
            type="date"
            value={empleado.fecha_contratacion}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="salario">Salario anual (€)</Label>
          <Input
            id="salario"
            name="salario"
            type="number"
            value={empleado.salario || ""}
            onChange={handleChange}
            className="mt-1"
            placeholder="Salario anual"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/empleados")}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : tipo === "crear"
            ? "Crear Empleado"
            : "Actualizar Empleado"}
        </Button>
      </div>
    </form>
  );
};

export default EmpleadoForm;
