
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { EuroIcon, DollarSign } from "lucide-react";

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
  tipo_salario: "mensual" | "anual";
  moneda: "ARS" | "USD";
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
  tipo_salario: "mensual",
  moneda: "ARS",
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

const puestos = [
  "CEO",
  "CTO",
  "Director/a",
  "Gerente",
  "Supervisor/a",
  "Analista",
  "Desarrollador/a",
  "Diseñador/a",
  "Contador/a",
  "Recepcionista",
  "Asistente",
  "Representante de Ventas",
  "Ejecutivo/a de Cuentas",
  "Especialista en Marketing",
  "Recursos Humanos",
  "Soporte Técnico",
  "Otro"
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
            // Convertimos los datos del empleado al tipo Empleado
            const empleadoData: Empleado = {
              ...data,
              salario: data.salario?.toString() || "",
              tipo_salario: data.tipo_salario || "mensual",
              moneda: data.moneda || "ARS",
            };
            setEmpleado(empleadoData);
          } else {
            toast("Error", {
              description: "Empleado no encontrado",
            });
            navigate("/empleados");
          }
        } catch (error: any) {
          console.error("Error al cargar empleado:", error);
          toast("Error", {
            description: `Error al cargar empleado: ${error.message}`,
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
      toast("Error", {
        description: "Debe iniciar sesión para realizar esta acción",
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

      toast(tipo === "crear" ? "Empleado creado" : "Empleado actualizado", {
        description: `${empleado.nombre} ${empleado.apellido} ha sido ${
          tipo === "crear" ? "añadido" : "actualizado"
        } correctamente.`,
      });

      navigate("/empleados");
    } catch (error: any) {
      console.error("Error:", error);
      toast("Error", {
        description: `Ha ocurrido un error: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="aurora-glass p-6 animate-fade-in rounded-lg shadow-xl border border-white/10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="nombre" className="text-white/90">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            value={empleado.nombre}
            onChange={handleChange}
            required
            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Nombre del empleado"
          />
        </div>

        <div>
          <Label htmlFor="apellido" className="text-white/90">Apellido</Label>
          <Input
            id="apellido"
            name="apellido"
            value={empleado.apellido}
            onChange={handleChange}
            required
            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Apellido del empleado"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-white/90">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={empleado.email}
            onChange={handleChange}
            required
            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="email@ejemplo.com"
          />
        </div>

        <div>
          <Label htmlFor="telefono" className="text-white/90">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            value={empleado.telefono || ""}
            onChange={handleChange}
            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Número de teléfono"
          />
        </div>

        <div>
          <Label htmlFor="puesto" className="text-white/90">Puesto</Label>
          <Select
            value={empleado.puesto}
            onValueChange={(value) => handleSelectChange("puesto", value)}
          >
            <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Seleccionar puesto" />
            </SelectTrigger>
            <SelectContent>
              {puestos.map((puesto) => (
                <SelectItem key={puesto} value={puesto}>
                  {puesto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="departamento" className="text-white/90">Departamento</Label>
          <Select
            value={empleado.departamento}
            onValueChange={(value) => handleSelectChange("departamento", value)}
          >
            <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
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
          <Label htmlFor="fecha_contratacion" className="text-white/90">Fecha de contratación</Label>
          <Input
            id="fecha_contratacion"
            name="fecha_contratacion"
            type="date"
            value={empleado.fecha_contratacion}
            onChange={handleChange}
            required
            className="mt-1 bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <Label htmlFor="salario" className="text-white/90">Salario</Label>
          <div className="flex items-end gap-2">
            <Input
              id="salario"
              name="salario"
              type="number"
              value={empleado.salario || ""}
              onChange={handleChange}
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Ingrese monto"
            />
          </div>
          
          <div className="mt-3">
            <Label className="text-white/90 mb-2 block">Tipo de salario</Label>
            <RadioGroup 
              value={empleado.tipo_salario} 
              onValueChange={(value) => handleSelectChange("tipo_salario", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mensual" id="mensual" />
                <Label htmlFor="mensual" className="text-white/90">Mensual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="anual" id="anual" />
                <Label htmlFor="anual" className="text-white/90">Anual</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="mt-3">
            <Label className="text-white/90 mb-2 block">Moneda</Label>
            <RadioGroup 
              value={empleado.moneda} 
              onValueChange={(value) => handleSelectChange("moneda", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ARS" id="peso" />
                <Label htmlFor="peso" className="text-white/90 flex items-center">
                  <EuroIcon className="h-4 w-4 mr-1" /> Peso Argentino
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="USD" id="dolar" />
                <Label htmlFor="dolar" className="text-white/90 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" /> Dólar
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/empleados")}
          disabled={isSubmitting}
          className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-aurora-blue hover:bg-blue-600 text-white"
        >
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
