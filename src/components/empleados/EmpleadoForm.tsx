
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface EmpleadoFormProps {
  tipo: "crear" | "editar";
}

interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  puesto: string;
  departamento: string;
  fechaContratacion: string;
  salario: string;
  telefono: string;
}

const empleadoInicial: Empleado = {
  id: "",
  nombre: "",
  apellido: "",
  email: "",
  puesto: "",
  departamento: "",
  fechaContratacion: new Date().toISOString().split("T")[0],
  salario: "",
  telefono: "",
};

// Datos de ejemplo para editar
const empleadosEjemplo: Record<string, Empleado> = {
  "1": {
    id: "1",
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "carlos@aurorarrhh.com",
    puesto: "Desarrollador Frontend",
    departamento: "Tecnología",
    fechaContratacion: "2023-01-15",
    salario: "45000",
    telefono: "123456789",
  },
  "2": {
    id: "2",
    nombre: "María",
    apellido: "González",
    email: "maria@aurorarrhh.com",
    puesto: "Diseñadora UX/UI",
    departamento: "Diseño",
    fechaContratacion: "2023-02-20",
    salario: "48000",
    telefono: "987654321",
  },
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
  const { toast } = useToast();

  useEffect(() => {
    // Si es modo edición y tenemos un ID, cargamos los datos del empleado
    if (tipo === "editar" && id) {
      // Aquí se implementará la carga desde Supabase
      // Por ahora usamos datos de ejemplo
      if (empleadosEjemplo[id]) {
        setEmpleado(empleadosEjemplo[id]);
      } else {
        toast({
          title: "Error",
          description: "Empleado no encontrado",
          variant: "destructive",
        });
        navigate("/empleados");
      }
    }
  }, [tipo, id, navigate, toast]);

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

    try {
      // Aquí se implementará la lógica para guardar en Supabase
      // Por ahora solo simulamos una operación exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: tipo === "crear" ? "Empleado creado" : "Empleado actualizado",
        description: `${empleado.nombre} ${empleado.apellido} ha sido ${
          tipo === "crear" ? "añadido" : "actualizado"
        } correctamente.`,
      });

      navigate("/empleados");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al procesar la solicitud.",
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
            value={empleado.telefono}
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
          <Label htmlFor="fechaContratacion">Fecha de contratación</Label>
          <Input
            id="fechaContratacion"
            name="fechaContratacion"
            type="date"
            value={empleado.fechaContratacion}
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
            value={empleado.salario}
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
